import { QueryTypes, Sequelize } from "sequelize";
import { withExceptionCatch } from "../../common/decorators/WithExceptionCatch";
import { GameSubscription, TeamSubscription } from "../../models/Subscriptions";
import { GameSubscriptionDto, TeamSubscriptionDto } from "../../common/dto/Subscription";
import { GAME_DOESNT_EXIST, SUBSCRIPTION_ALREADY_EXISTS, SUBSCRIPTION_DOESNT_EXISTS, TEAM_DOESNT_EXIST } from "../../common/exceptions/SubscriptionExceptions";
import { ISubscriptionsService } from "./ISubscriptionsService";

export class SubscriptionsService implements ISubscriptionsService {
  constructor(
    private connection: Sequelize, 
    private gameSubModel: typeof GameSubscription,
    private teamSubModel: typeof TeamSubscription
  ) {}
  
  private async doesGameExist(id: number): Promise<boolean> {
    const result = await this.connection.query("SELECT * FROM `games` WHERE id = " + id + ";", { type: QueryTypes.SELECT })
    return Boolean(result.length)
  }

  private async doesGameSubscriptionExist(userId: string, gameId: number): Promise<boolean> {
    const result = await this.connection.query("SELECT * FROM `users_subscriptions_games` WHERE game_id = " + gameId + " AND user_id = " + userId + ";", { type: QueryTypes.SELECT })
    console.log(result)
    return Boolean(result.length)
  }

  private async doesTeamExist(id: number): Promise<boolean> {
    const result = await this.connection.query("SELECT * FROM `teams` WHERE id = " + id + ";", { type: QueryTypes.SELECT })
    return Boolean(result.length)
  }

  private async doesTeamSubscriptionExist(userId: string, gameId: number): Promise<boolean> {
    const result = await this.connection.query("SELECT * FROM `users_subscriptions_teams` WHERE team_id = " + gameId + " AND user_id = " + userId + ";", { type: QueryTypes.SELECT })
    console.log(result)
    return Boolean(result.length)
  }

  @withExceptionCatch
  public async createGameSubscription(subscription: GameSubscriptionDto) {
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
  public async deleteGameSubscription(id: number) {
    const destroyedRows = await this.gameSubModel.destroy({
      where: { id }
    })
    if (!destroyedRows) {
      return SUBSCRIPTION_DOESNT_EXISTS
    }
  }

  @withExceptionCatch
  public async createTeamSubscription(subscription: TeamSubscriptionDto) {
    if (!await this.doesTeamExist(subscription.team_id)) {
      return TEAM_DOESNT_EXIST
    }

    if (await this.doesTeamSubscriptionExist(subscription.user_id, subscription.team_id)) {
      return SUBSCRIPTION_ALREADY_EXISTS
    }

    const createdSubscription = await this.teamSubModel.create(subscription as any)
    return createdSubscription
  }

  @withExceptionCatch
  public async deleteTeamSubscription(id: number) {
    const destroyedRows = await this.teamSubModel.destroy({
      where: { id }
    })
    if (!destroyedRows) {
      return SUBSCRIPTION_DOESNT_EXISTS
    }
  }
}