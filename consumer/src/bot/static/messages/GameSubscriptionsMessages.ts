import { SubscribedGame } from "../../../common/dto/Game"
import { Message } from "../../../common/utils/types/Message"
import moment from "moment"


export const GamesToUnsubscribe = (games: SubscribedGame[]): Message => {
  let message = "Enter position of game to unsubscribe:\n"
  for (let i = 0; i < games.length; i++) {
    const game = games[i]
    message += `${i+1}: ${moment(game.created_at).format('dd-mm-yyyy')} ${game.team_one_name} VS ${game.team_two_name} (${game.team_one_score} - ${game.team_two_score})\n`
  }
  return message
}

export const SubscribedGames = (games: SubscribedGame[]): Message => {
  let message = "Your games:\n"
  for (const game of games) {
    message += `${moment(game.created_at).format('dd-mm-yyyy')} ${game.team_one_name} VS ${game.team_two_name} (${game.team_one_score} - ${game.team_two_score})\n`
  }
  return message
}

export const GamesToSubscribe = (games: SubscribedGame[]): Message => {
  let message = "Enter position of game to subscribe:\n"
  
  for (let i = 0; i < games.length; i++) {
    const game = games[i]
    message += `${i+1}: ${game.team_one_name} VS ${game.team_two_name}\n`
  }
  return message
}

export const NoGamesToSubscribe = (): Message => "There are no games to subscribe"

export const NoSubscribedGames = (): Message => "You haven't subscribed to any games events\n/subscribe - to subscribe to game events"

export const SubscribedToGame = (): Message => "Successfully subscribed to game events"

export const UnsubscribedFromGame = (): Message => "Successfully unsubscribed from game events"