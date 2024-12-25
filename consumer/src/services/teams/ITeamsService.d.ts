import { SubscribedTeam } from "../../common/dto/Team";
import { Exception } from "../../common/utils/types/Exception";
import { Team } from "../../models/Team";

export interface ITeamsService {
  getTeams(): Promise<Team[] | Exception>
  getSubscribedTeams(userId: string): Promise<SubscribedTeam[] | Exception>
}