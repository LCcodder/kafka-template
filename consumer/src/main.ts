import { Scenes, session, Telegraf } from 'telegraf'
import { initDataSource } from './database/Init'
import { UsersService } from './services/users/UsersService'
import { User } from './models/User'
import { bindCommands } from './bot/CommandsBinder'
import { UserIDChecker } from './bot/middlewares/IDCheckerMiddleware'
import { SubscriptionsService } from './services/subscriptions/SubscriptionsService'
import { GameSubscription } from './models/Subscriptions'
import { initGamesMenuScene } from './bot/scenes/GamesMenuScene'
import { GamesService } from './services/games/GamesService'
import { Game } from './models/Game'

const main = async () => {
  const bot = new Telegraf<Scenes.SceneContext>("6605761193:AAGn6uzdsdmHnAJcaWi8mrskz0esrCCcbuo")
  const connection = await initDataSource()
  
  const usersService = new UsersService(User)
  const subscriptionsService = new SubscriptionsService(connection, User, GameSubscription)
  const gamesService = new GamesService(connection, Game)

  const stage = new Scenes.Stage<Scenes.SceneContext>([ initGamesMenuScene(gamesService, subscriptionsService) ], { ttl: 10 })
  bot.use(session())
  bot.use(stage.middleware())
  bot.use(UserIDChecker(usersService))
  bindCommands(bot, usersService, subscriptionsService)
  
  bot.on('message', (ctx) => {
    ctx.reply('One Hi')
  })
  
  bot.launch()
  
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}
main()
