import { GameSubscriptionDto } from "../../common/dto/Subscription";
import { Exception } from "../../common/utils/types/Exception";
import { GameSubscription } from "../../models/Subscriptions";

export interface ISubscriptionsService {
  createGameSubscription(subscription: GameSubscriptionDto): Promise<GameSubscription | Exception>
  deleteGameSubscription(subscriptionId: number): Promise<Exception | undefined>
}