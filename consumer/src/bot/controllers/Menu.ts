import { SubscriptionsService } from "../../services/subscriptions/SubscriptionsService"
import { isException } from "../../common/utils/guards/IsException";
import { GameSubscription } from "../../models/Subscriptions";
import { Context } from "telegraf";
import { GamesService } from "../../services/games/GamesService";
import { GameWithTeamNames } from "../../common/dto/Game";
import { Menu } from "../static/messages/MenuMessages";

export const menuControllerFactory = (gamesService: GamesService) => 
  async (ctx: Context) => {

  const userId = ctx.chat?.id.toString() as string
  const subscribedGames = await gamesService.getSubscribedGames(userId)
  if (isException(subscribedGames) && subscribedGames.critical) {
    await ctx.sendMessage(subscribedGames.message)
    return
  }
  await ctx.sendMessage(Menu({
    gamesSubscriptionsCount: (subscribedGames as GameWithTeamNames[]).length,
    teamsSubscriptionsCount: 0,
    telegramUsername: ctx.from?.username as string
  }))
}