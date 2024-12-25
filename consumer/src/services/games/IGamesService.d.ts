import { SubscribedGame } from "../../common/dto/Game"
import { Exception } from "../../common/utils/types/Exception"

export interface IGamesService {
  getSubscribedGames(userId: string): Promise<SubscribedGame[] | Exception>
  getGamesInProgress(): Promise<SubscribedGame[] | Exception>
}