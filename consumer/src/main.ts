import { Telegraf } from 'telegraf'
import { initDataSource } from './database/Init'
import { UsersService } from './services/users/UsersService'
import { User } from './models/User'
import { bindCommands } from './bot/CommandsBinder'
import { UserIDChecker } from './bot/middlewares/IDCheckerMiddleware'
import { SubscriptionsService } from './services/subscriptions/SubscriptionsService'
import { GameSubscription } from './models/Subscriptions'

const main = async () => {
  const bot = new Telegraf("6605761193:AAGn6uzdsdmHnAJcaWi8mrskz0esrCCcbuo")
  const connection = await initDataSource()
  
  const usersService = new UsersService(User)
  const subscriptionsService = new SubscriptionsService(connection, User, GameSubscription)

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
