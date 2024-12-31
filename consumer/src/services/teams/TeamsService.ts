import { QueryTypes, Sequelize } from "sequelize";
import { withExceptionCatch } from "../../shared/decorators/WithExceptionCatch";
import { Team } from "../../models/Team";
import { SubscribedTeam } from "../../shared/dto/Team";

export class TeamsService {
  constructor(private connection: Sequelize, private teamModel: typeof Team) {}

  @withExceptionCatch
  public async getSubscribedTeams(userId: string) {
    const query = 'select teams.name, users_subscriptions_teams.id from `teams` inner join `users_subscriptions_teams` on users_subscriptions_teams.team_id = teams.id and users_subscriptions_teams.user_id = "' + userId + '";'

    const result = (await this.connection.query(query, { type: QueryTypes.SELECT })) as SubscribedTeam[]
    
    return result.length ? result : []
  }

  @withExceptionCatch
  public async getTeams() {
    return this.teamModel.findAll()
  }
}