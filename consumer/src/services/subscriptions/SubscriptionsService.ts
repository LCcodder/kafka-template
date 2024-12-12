import { QueryTypes, Sequelize } from "sequelize";
import { withExceptionCatch } from "../../common/decorators/WithExceptionCatch";
import { USER_NOT_FOUND } from "../../common/exceptions/UserExceptions";
import { Exception } from "../../common/utils/types/Exception";
import { GameSubscription } from "../../models/Subscriptions";
import { User } from "../../models/User";
import { GameSubscriptionDto } from "../../common/dto/Subscription";
import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";
import { GAME_DOESNT_EXIST, SUBSCRIPTION_ALREADY_EXISTS } from "../../common/exceptions/SubscriptionExamples";

export class SubscriptionsService {
  constructor(private connection: Sequelize, private userModel: typeof User, private gameSubModel: typeof GameSubscription) {}
  
  private async doesGameExist(id: number): Promise<boolean> {
    const result = await this.connection.query("SELECT * FROM `games` WHERE id = " + id + ";", { type: QueryTypes.SELECT })
    return Boolean(result.length)
  }

  private async doesGameSubscriptionExist(userId: string, gameId: number): Promise<boolean> {
    const result = await this.connection.query("SELECT * FROM `users_subscriptions_games` WHERE game_id = " + gameId + " AND user_id = " + userId + ";")
    return Boolean(result.length)
  }

  @withExceptionCatch
  public async createGameSubscription(subscription: GameSubscriptionDto): Promise<GameSubscription | Exception> {
    if (!await this.doesGameExist(subscription.game_id)) {
      return GAME_DOESNT_EXIST
    }

    if (await this.doesGameSubscriptionExist(subscription.user_id, subscription.game_id)) {
      return SUBSCRIPTION_ALREADY_EXISTS
    }

    const createdSubscription = await this.gameSubModel.create(subscription as any)
    return createdSubscription
  }
 
  @withExceptionCatch
  public async getGamesSubscriptionsByUserId(id: string): Promise<GameSubscription[] | Exception> {
    const user = await this.userModel.findByPk(id)
    if (!user) {
      return USER_NOT_FOUND
    }

    return user.gameSubscriptions ? user.gameSubscriptions : []
  }
}