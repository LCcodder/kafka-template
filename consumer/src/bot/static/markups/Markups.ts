import { Markup } from "telegraf";

export const actionExitMarkup = Markup.keyboard([
  [
    { text: "Exit" }
  ]
])

export const chooseEntityMarkup = Markup.keyboard([
  [
    { text: "Game" },
    { text: "Team" }
  ],
  [
    { text: "Exit" }
  ]
])
