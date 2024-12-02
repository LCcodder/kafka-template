import { Markup } from "telegraf";

export const menuKeyboard = Markup.inlineKeyboard([
  [{ text: 'Games subscriptions', callback_data: 'games_subscriptions_menu' }, 
    { text: 'Teams subscriptions', callback_data: 'teams_subscriptions_menu' },]
])
