import { GameSubscriptionDto, TeamSubscriptionDto } from "../../common/dto/Subscription";
import { Exception } from "../../common/utils/types/Exception";
import { GameSubscription, TeamSubscription } from "../../models/Subscriptions";

export interface ISubscriptionsService {
  createGameSubscription(subscription: GameSubscriptionDto): Promise<GameSubscription | Exception>
  deleteGameSubscription(subscriptionId: number): Promise<Exception | void>
  createTeamSubscription(subscription: TeamSubscriptionDto): Promise<TeamSubscription | Exception>
  deleteTeamSubscription(subscriptionId: number): Promise<Exception | void>
}