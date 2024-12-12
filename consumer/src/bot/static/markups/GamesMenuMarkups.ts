import { Markup } from "telegraf";

export const gamesMenuKeyboard = Markup.inlineKeyboard([
  [
    { text: "Subscribe", callback_data: "choose_game_to_subscribe" },
    { text: "Unsubscribe", callback_data: "choose_game_to_unsubscribe" },
  ],
  [
    { text: "Back to menu", callback_data: "menu" }
  ]
])

export const inactionKeyboard = Markup.inlineKeyboard([
  [
    { text: "Back to subs menu", callback_data: "games_subscriptions_menu" }
  ]
])