import { Message } from "../../../common/utils/types/Message"

export const OpenMenu = (): Message => "Open menu to see available actions"

type MenuUserStats = {
  telegramUsername: string
  gamesSubscriptionsCount: number
  teamsSubscriptionsCount: number
}

export const Menu = (stats: MenuUserStats): Message => `
Welcome to subscription aggregator bot!

Current subscriptions for @${stats.telegramUsername}:
Games subscriptions: ${stats.gamesSubscriptionsCount}
Teams subscriptions: ${stats.teamsSubscriptionsCount}

Commands list:
/subscribed_games
/subscribe_to_game

`