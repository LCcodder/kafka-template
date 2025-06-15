import { Scenes, session, Telegraf } from 'telegraf'
import { initDataSource } from './database/Init'
import { UsersService } from './services/users/UsersService'
import { User } from './models/User'
import { signUpMiddleware } from './bot/middlewares/SignUpMiddleware'
import { SubscriptionsService } from './services/subscriptions/SubscriptionsService'
import { GameSubscription, TeamSubscription } from './models/Subscriptions'
import { subscribeToGameScene } from './bot/scenes/SubscribeToGameScene'
import { GamesService } from './services/games/GamesService'
import { chooseEntityForInteractionScene } from './bot/scenes/ChooseEntityForInteractionScene'
import { unsubscribeFromGameScene } from './bot/scenes/UnsubscribeFromGame'
import { subscribeToTeamScene } from './bot/scenes/SubscribeToTeamScene'
import { TeamsService } from './services/teams/TeamsService'
import { Team } from './models/Team'
import { unsubscribeFromTeamScene } from './bot/scenes/UnsubscribeFromTeamScene'
import { controllersFactory } from './bot/controllers/ControllersFactory'
import { EventsService } from './services/events/service/EventsService'
import { Kafka } from "kafkajs"
import { CONFIG } from './shared/config/Config'
import { ACTIONS } from './bot/static/actions/ScenesActions'

const main = async () => {
  CONFIG.log()

  const bot = new Telegraf<Scenes.WizardContext>(CONFIG.botToken)

  const connection = await initDataSource()
  const mq = new Kafka({ brokers: CONFIG.kafkaClustersConnections })

  const usersService = new UsersService(connection, User)
  const subscriptionsService = new SubscriptionsService(connection, GameSubscription, TeamSubscription)
  const gamesService = new GamesService(connection)
  const teamsService = new TeamsService(connection, Team)

  const eventService = new EventsService(bot.telegram, mq.consumer({ groupId: 'telegram-bot' }), usersService)
  await eventService.listenEvents()

  const stage = new Scenes.Stage<Scenes.WizardContext>(
    [ 
      subscribeToGameScene(gamesService, subscriptionsService),
      subscribeToTeamScene(teamsService, subscriptionsService),
      chooseEntityForInteractionScene(ACTIONS.SUBSCRIBE, ACTIONS.SUBSCRIBE_TO_GAME, ACTIONS.SUBSCRIBE_TO_TEAM),

      unsubscribeFromTeamScene(teamsService, subscriptionsService),
      unsubscribeFromGameScene(gamesService, subscriptionsService),      
      chooseEntityForInteractionScene(ACTIONS.UNSUBSCRIBE, ACTIONS.UNSUBSCRIBE_FROM_GAME, ACTIONS.UNSUBSCRIBE_FROM_TEAM)
    ], { ttl: 10 }
  )

  bot.use(session())
  bot.use(stage.middleware())
  bot.use(signUpMiddleware(usersService))
  
  
  const controllers = controllersFactory(gamesService, teamsService)
  
  bot.command('start', controllers.menu)
  bot.command('menu', controllers.menu)
  bot.command('subscribe', (ctx) => ctx.scene.enter(ACTIONS.SUBSCRIBE))
  bot.command('unsubscribe', (ctx) => ctx.scene.enter(ACTIONS.UNSUBSCRIBE))
  bot.command("mygames", controllers.getSubscribedGames)
  bot.command("myteams", controllers.getSubscribedTeams)

  
  bot.launch()
  
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}
main()
