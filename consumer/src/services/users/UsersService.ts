import { QueryTypes, Sequelize } from "sequelize";
import { withExceptionCatch } from "../../shared/decorators/WithExceptionCatch";
import { UserDto } from "../../shared/dto/User";
import { USER_ALREADY_REGISTERED, USER_NOT_FOUND } from "../../shared/exceptions/UserExceptions";
import { User } from "../../models/User";
import { IUsersService, UsersSubscriptionsIdentifiers } from "./IUsersService";

export class UsersService implements IUsersService {
  constructor(
    private connection: Sequelize, 
    private model: typeof User
  ) {}

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
  public async getSubscribers({ teamOneId, teamTwoId, gameId }: UsersSubscriptionsIdentifiers) {
    const query = 
    'SELECT users.id FROM `users` INNER JOIN `users_subscriptions_teams` ON users_subscriptions_teams.user_id = users.id AND users_subscriptions_teams.team_id = ' + teamOneId +
    ' UNION ' +
    'SELECT users.id FROM `users` INNER JOIN `users_subscriptions_teams` ON users_subscriptions_teams.user_id = users.id AND users_subscriptions_teams.team_id = ' + teamTwoId +
    ' UNION ' +
    'SELECT users.id FROM `users` INNER JOIN `users_subscriptions_games` ON users_subscriptions_games.user_id = users.id AND users_subscriptions_games.game_id = ' + gameId + ';'
  
    const result = (await this.connection.query(query, { type: QueryTypes.SELECT })) as UserDto[]
    
    return result.length ? result : []
  }
}