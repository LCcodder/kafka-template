import { Context } from "telegraf"
import { isException } from "../../common/utils/guards/IsException"
import { NoSubscribedGames, SubscribedGames } from "../static/messages/GameSubscriptionsMessages"
import { IGamesService } from "../../services/games/IGamesService"

export const getSubscribedGamesControllerFactory = (gamesService: IGamesService) => async (ctx: Context) => {

  const games = await gamesService.getSubscribedGames(ctx.chat?.id as unknown as string)
  if (isException(games)) {
    await ctx.sendMessage(games.message)  
    return
  }

  if (!games.length) {
    await ctx.sendMessage(NoSubscribedGames())
    return
  }
  
  await ctx.sendMessage(SubscribedGames(games))
}