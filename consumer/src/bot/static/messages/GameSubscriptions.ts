import { GameWithTeamNames } from "../../../common/dto/Game"
import { Message } from "../../../common/utils/types/Message"


export const SubscribedGames = (games: GameWithTeamNames[]): Message => {
  if (!games.length) return "You haven't subscibed to any game"
  let message = "Your games:\n"
  for (const game of games) {
    message += `${game.team_one_name} VS ${game.team_two_name} (${game.team_one_score} - ${game.team_two_score})\n`
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

export const SubscibedToGame = (): Message => "Successfully subscribed to game"