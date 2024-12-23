import { GameWithTeamNames } from "../../common/dto/Game"
import { Exception } from "../../common/utils/types/Exception"

export interface IGamesService {
  getSubscribedGames(userId: string): Promise<GameWithTeamNames[] | Exception>
  getGamesInProgress(): Promise<GameWithTeamNames[] | Exception>
}