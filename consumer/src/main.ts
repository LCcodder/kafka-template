import { Markup, Telegraf } from 'telegraf'

const bot = new Telegraf("6605761193:AAGn6uzdsdmHnAJcaWi8mrskz0esrCCcbuo")

bot.on('message', (ctx) => {
  ctx.reply('One Hi')
})

bot.launch()
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))