import { IGamesService } from "../../services/games/IGamesService";
import { ITeamsService } from "../../services/teams/ITeamsService";
import { getSubscribedGamesControllerFactory } from "./GetSubscribedGames";
import { getSubscribedTeamsControllerFactory } from "./GetSubscribedTeams";
import { menuControllerFactory } from "./Menu";

export type Controllers = {
  getSubscribedGames: ReturnType<typeof getSubscribedGamesControllerFactory>
  getSubscribedTeams: ReturnType<typeof getSubscribedTeamsControllerFactory>
  menu: ReturnType<typeof menuControllerFactory>
}

export const controllersFactory = (
  gamesService: IGamesService,
  teamsService: ITeamsService
): Controllers => {
  return {
    getSubscribedGames: getSubscribedGamesControllerFactory(gamesService),
    menu: menuControllerFactory(gamesService, teamsService),
    getSubscribedTeams: getSubscribedTeamsControllerFactory(teamsService)
  }
}