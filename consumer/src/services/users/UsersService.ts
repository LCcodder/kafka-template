import { QueryTypes, Sequelize } from "sequelize";
import { withExceptionCatch } from "../../common/decorators/WithExceptionCatch";
import { UserDto } from "../../common/dto/User";
import { USER_ALREADY_REGISTERED, USER_NOT_FOUND } from "../../common/exceptions/UserExceptions";
import { User } from "../../models/User";
import { IUsersService } from "./IUsersService";

export class UsersService implements IUsersService {
  constructor(private connection: Sequelize, private model: typeof User) {}

  @withExceptionCatch
  public async getUserById(id: string) {
    const user = await this.model.findByPk(id)

    if (user == null) return USER_NOT_FOUND
    
    return user
  }

  @withExceptionCatch
  public async createUser(user: UserDto) {
    if (await this.model.findByPk(user.id)) return USER_ALREADY_REGISTERED
    await this.model.create(user)
  }

  @withExceptionCatch
  public async getTeamSubscribers(teamId: number) {
    const query = 'select users.id from `users` inner join `users_subscriptions_teams` on users_subscriptions_teams.user_id = users.id and users_subscriptions_teams.team_id =' + teamId + ';'
    const result = (await this.connection.query(query, { type: QueryTypes.SELECT })) as UserDto[]
    
    return result.length ? result : []
  }

  @withExceptionCatch
  public async getGameSubscribers(gameId: number) {
    const query = 'select users.id from `users` inner join `users_subscriptions_games` on users_subscriptions_games.user_id = users.id and users_subscriptions_games.game_id =' + gameId + ';'
    const result = (await this.connection.query(query, { type: QueryTypes.SELECT })) as UserDto[]
    
    return result.length ? result : []
  }
}