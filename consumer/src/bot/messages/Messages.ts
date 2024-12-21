import { GameWithTeamNames } from "../../common/dto/Game"
import { Game } from "../../models/Game"

type Message = string
export const UserCreated = (): Message => "User successfully registrated\n"
export const OpenMenu = (): Message => "Open menu to see available actions"

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

export const SubscribedGames = (games: GameWithTeamNames[]): Message => {
  if (!games.length) return "You haven't subscibed to any game"
  let message = "Your games:\n"
  for (const game of games) {
    message += `${game.created_at}: ${game.team_one_name} VS ${game.team_two_name}\n`
  }
  return message
}

export const GamesToSubscribe = (games: GameWithTeamNames[]): Message => {
  if (!games.length) return "There are no games to subscribe"
  let message = "Enter position of game to subscribe:\n"
  
  for (let i = 0; i < games.length; i++) {
    const game = games[i]
    message += `${i+1}: ${game.team_one_name} VS ${game.team_two_name}\n`
  }
  return message
}