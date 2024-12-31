import { SubscribedTeam } from "../../shared/dto/Team";
import { Exception } from "../../shared/utils/types/Exception";
import { Team } from "../../models/Team";

export interface ITeamsService {
  getTeams(): Promise<Team[] | Exception>
  getSubscribedTeams(userId: string): Promise<SubscribedTeam[] | Exception>
}