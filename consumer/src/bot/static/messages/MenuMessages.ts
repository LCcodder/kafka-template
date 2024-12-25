import { Message } from "../../../common/utils/types/Message"


type MenuUserStats = {
  telegramUsername: string
  gamesSubscriptionsCount: number
  teamsSubscriptionsCount: number
}

export const Menu = (stats: MenuUserStats): Message => `
Welcome to subscription aggregator bot!

Current subscriptions for @${stats.telegramUsername}:
Games subscriptions 🏀: ${stats.gamesSubscriptionsCount}
Teams subscriptions 👬: ${stats.teamsSubscriptionsCount}

Commands list 📜:
/subscribe - subscribe to team/game events
/unsubscribe - unsubscribe from team/game events
/mygames - show subscribed games
/myteams - show subscribed teams
`