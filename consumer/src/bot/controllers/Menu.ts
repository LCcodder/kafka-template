import { SubscriptionsService } from "../../services/subscriptions/SubscriptionsService"
import { isException } from "../../common/utils/guards/IsException";
import { OpenMenu, UserCreated, Menu } from "../messages/Messages";
import { GameSubscription } from "../../models/Subscriptions";
import { Context } from "telegraf";

export const menuControllerFactory = (subscriptionsService: SubscriptionsService) => 
  async (ctx: Context) => {
  ctx.deleteMessage(ctx.message?.message_id)

  const userId = ctx.chat?.id.toString() as string
  const gamesSubscriptions = await subscriptionsService.getGamesSubscriptionsByUserId(userId)
  if (isException(gamesSubscriptions) && gamesSubscriptions.critical) {
    await ctx.sendMessage(gamesSubscriptions.message)
    return
  }
  await ctx.sendMessage(Menu({
    gamesSubscriptionsCount: (gamesSubscriptions as GameSubscription[]).length,
    teamsSubscriptionsCount: 0,
    telegramUsername: ctx.from?.username as string
  }))
}