import { SubscribedGame } from "../../shared/dto/Game"
import { Exception } from "../../shared/utils/types/Exception"

export interface IGamesService {
  getSubscribedGames(userId: string): Promise<SubscribedGame[] | Exception>
  getGamesInProgress(): Promise<SubscribedGame[] | Exception>
}