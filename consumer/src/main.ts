import { Scenes, session, Telegraf } from 'telegraf'
import { initDataSource } from './database/Init'
import { UsersService } from './services/users/UsersService'
import { User } from './models/User'
import { bindCommands } from './bot/CommandsBinder'
import { signUpUser } from './bot/middlewares/SignUpMiddleware'
import { SubscriptionsService } from './services/subscriptions/SubscriptionsService'
import { GameSubscription } from './models/Subscriptions'
import { subscribeToGameScene } from './bot/scenes/SubscribeToGameScene'
import { GamesService } from './services/games/GamesService'
import { Game } from './models/Game'
import { WizardContext, WizardContextWizard } from 'telegraf/typings/scenes'
import { chooseEntityForInteractionScene } from './bot/scenes/ChooseEntityForInteractionScene'
import { SUBSCRIBE, SUBSCRIBE_TO_GAME } from './bot/static/actions/ScenesActions'

const main = async () => {
  const bot = new Telegraf<Scenes.WizardContext>("6605761193:AAGn6uzdsdmHnAJcaWi8mrskz0esrCCcbuo")
  const connection = await initDataSource()
  
  const usersService = new UsersService(User)
  const subscriptionsService = new SubscriptionsService(connection, User, GameSubscription)
  const gamesService = new GamesService(connection)

  const stage = new Scenes.Stage<Scenes.WizardContext>(
    [ 
      subscribeToGameScene(gamesService, subscriptionsService),
      chooseEntityForInteractionScene(SUBSCRIBE, SUBSCRIBE_TO_GAME, '')
    ], { ttl: 10 }
  )

  bot.use(session())
  bot.use(stage.middleware())
  bot.use(signUpUser(usersService))
  
  bindCommands(bot, usersService, gamesService, subscriptionsService)
  
  bot.launch()
  
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}
main()
