import { Scenes, session, Telegraf } from 'telegraf'
import { initDataSource } from './database/Init'
import { UsersService } from './services/users/UsersService'
import { User } from './models/User'
import { bindCommands } from './bot/CommandsBinder'
import { signUpUser } from './bot/middlewares/SignUpMiddleware'
import { SubscriptionsService } from './services/subscriptions/SubscriptionsService'
import { GameSubscription, TeamSubscription } from './models/Subscriptions'
import { subscribeToGameScene } from './bot/scenes/SubscribeToGameScene'
import { GamesService } from './services/games/GamesService'
import { chooseEntityForInteractionScene } from './bot/scenes/ChooseEntityForInteractionScene'
import { SUBSCRIBE, SUBSCRIBE_TO_GAME, SUBSCRIBE_TO_TEAM, UNSUBSCRIBE, UNSUBSCRIBE_FROM_GAME, UNSUBSCRIBE_FROM_TEAM } from './bot/static/actions/ScenesActions'
import { unsubscribeFromGameScene } from './bot/scenes/UnsubscribeFromGame'
import { subscribeToTeamScene } from './bot/scenes/SubscribeToTeamScene'
import { TeamsService } from './services/teams/TeamsService'
import { Team } from './models/Team'
import { unsubscribeFromTeamScene } from './bot/scenes/UnsubscribeFromTeamScene'
import { createControllers } from './bot/controllers/ControllersFactory'
import { EventsService } from './services/events/service/EventsService'
import { Kafka } from "kafkajs"

const main = async () => {
  const bot = new Telegraf<Scenes.WizardContext>("6605761193:AAGn6uzdsdmHnAJcaWi8mrskz0esrCCcbuo")

  const connection = await initDataSource()
  const mq = new Kafka({ brokers: ['localhost:29092'] })

  const usersService = new UsersService(connection, User)
  const subscriptionsService = new SubscriptionsService(connection, GameSubscription, TeamSubscription)
  const gamesService = new GamesService(connection)
  const teamsService = new TeamsService(connection, Team)
  
  // const eventService = new EventsService(bot.telegram, mq.consumer({ groupId: 'telegram-bot' }))
  // await eventService.listenEvents()

  const stage = new Scenes.Stage<Scenes.WizardContext>(
    [ 
      subscribeToGameScene(gamesService, subscriptionsService),
      subscribeToTeamScene(teamsService, subscriptionsService),
      chooseEntityForInteractionScene(SUBSCRIBE, SUBSCRIBE_TO_GAME, SUBSCRIBE_TO_TEAM),

      unsubscribeFromTeamScene(teamsService, subscriptionsService),
      unsubscribeFromGameScene(gamesService, subscriptionsService),      
      chooseEntityForInteractionScene(UNSUBSCRIBE, UNSUBSCRIBE_FROM_GAME, UNSUBSCRIBE_FROM_TEAM)
    ], { ttl: 10 }
  )

  bot.use(session())
  bot.use(stage.middleware())
  bot.use(signUpUser(usersService))
  
  const controllers = createControllers(gamesService, teamsService)
  bindCommands(bot, controllers)
  
  bot.launch()
  
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}
main()
