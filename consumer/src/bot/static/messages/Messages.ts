type Message = string
export const UserCreated = (): Message => "User successfully registrated\n"
export const OpenMenu = (): Message => "Use /menu to see available actions"

type MenuUserStats = {
  telegramUsername: string
  gamesSubscriptionsCount: number
  teamsSubscriptionsCount: number
}
export const Menu = (stats: MenuUserStats): Message => `
Subscriptions for @${stats.telegramUsername}:
Games subscriptions: ${stats.gamesSubscriptionsCount}
Teams subscriptions: ${stats.teamsSubscriptionsCount}
`
export const NotRegistered = (): Message => "You are not registered\nUse /start to register in system"