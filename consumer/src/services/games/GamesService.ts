import { QueryTypes, Sequelize } from "sequelize";
import { Exception } from "../../common/utils/types/Exception";
import { Game } from "../../models/Game";
import { withExceptionCatch } from "../../common/decorators/WithExceptionCatch";
import { GameWithTeamNames } from "../../common/dto/Game";
import { SUBSCRIPTION_ALREADY_EXISTS } from "../../common/exceptions/SubscriptionExamples";



export class GamesService {
  constructor(private connection: Sequelize, private gameModel: typeof Game) {}

  @withExceptionCatch
  public async getSubscribedGames(userId: string): Promise<GameWithTeamNames[] | Exception> {
    const query = 'select t1.name as team_one_name, t2.name as team_two_name, games.id, games.team_one_score, games.team_two_score, games.team_one_id, games.team_two_id, games.is_ended, games.created_at, games.updated_at from `games` inner join `teams` t1 on games.team_one_id = t1.id inner join `teams` t2 on games.team_two_id = t2.id inner join `users_subscriptions_games` on users_subscriptions_games.game_id = games.id and users_subscriptions_games.user_id = "' + userId + '" order by games.created_at desc;'
    const result = (await this.connection.query(query, { type: QueryTypes.SELECT })) as GameWithTeamNames[]
    
    return result.length ? result : []
  }

  @withExceptionCatch
  public async getGamesInProgress(): Promise<GameWithTeamNames[] | Exception> {
    const query = "select t1.name as team_one_name, t2.name as team_two_name, games.id, games.team_one_score, games.team_two_score, games.team_one_id, games.team_two_id, games.is_ended, games.created_at, games.updated_at from `games` inner join `teams` t1 on games.team_one_id = t1.id inner join `teams` t2 on games.team_two_id = t2.id order by games.created_at desc;"
    const result = (await this.connection.query(query, { type: QueryTypes.SELECT })) as GameWithTeamNames[]
    
    return result.length ? result : []
  }
}

