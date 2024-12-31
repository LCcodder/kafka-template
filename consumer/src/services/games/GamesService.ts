import { QueryTypes, Sequelize } from "sequelize";
import { withExceptionCatch } from "../../shared/decorators/WithExceptionCatch";
import { SubscribedGame } from "../../shared/dto/Game";
import { IGamesService } from "./IGamesService";



export class GamesService implements IGamesService {
  constructor(private connection: Sequelize) {}

  @withExceptionCatch
  public async getSubscribedGames(userId: string) {
    const query = 'select t1.name as team_one_name, t2.name as team_two_name, users_subscriptions_games.id, games.team_one_score, games.team_two_score, games.team_one_id, games.team_two_id, games.is_ended, games.created_at, games.updated_at from `games` inner join `teams` t1 on games.team_one_id = t1.id inner join `teams` t2 on games.team_two_id = t2.id inner join `users_subscriptions_games` on users_subscriptions_games.game_id = games.id and users_subscriptions_games.user_id = "' + userId + '" order by games.created_at desc;'
    const result = (await this.connection.query(query, { type: QueryTypes.SELECT })) as SubscribedGame[]
    
    return result.length ? result : []
  }

  @withExceptionCatch
  public async getGamesInProgress() {
    const query = "select t1.name as team_one_name, t2.name as team_two_name, games.id, games.team_one_score, games.team_two_score, games.team_one_id, games.team_two_id, games.is_ended, games.created_at, games.updated_at from `games` inner join `teams` t1 on games.team_one_id = t1.id inner join `teams` t2 on games.team_two_id = t2.id order by games.created_at desc;"
    const result = (await this.connection.query(query, { type: QueryTypes.SELECT })) as SubscribedGame[]
    
    return result.length ? result : []
  }
}

