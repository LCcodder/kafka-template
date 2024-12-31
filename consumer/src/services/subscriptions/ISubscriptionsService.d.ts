import { GameSubscriptionDto, TeamSubscriptionDto } from "../../shared/dto/Subscription";
import { Exception } from "../../shared/utils/types/Exception";
import { GameSubscription, TeamSubscription } from "../../models/Subscriptions";

export interface ISubscriptionsService {
  createGameSubscription(subscription: GameSubscriptionDto): Promise<GameSubscription | Exception>
  deleteGameSubscription(subscriptionId: number): Promise<Exception | void>
  createTeamSubscription(subscription: TeamSubscriptionDto): Promise<TeamSubscription | Exception>
  deleteTeamSubscription(subscriptionId: number): Promise<Exception | void>
}