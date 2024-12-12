import { Markup } from "telegraf";

export const menuActionsKeyboard = Markup.inlineKeyboard([
  [{ text: 'Games subscriptions', callback_data: 'games_subscriptions_menu' }, 
    { text: 'Teams subscriptions', callback_data: 'teams_subscriptions_menu' },]
])

export const openMenuKeyboard = Markup.inlineKeyboard([
  [ { text: 'Menu', callback_data: 'menu' } ]
])