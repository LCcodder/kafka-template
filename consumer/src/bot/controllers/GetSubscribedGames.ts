import { Context } from "telegraf"
import { GamesService } from "../../services/games/GamesService"
import { isException } from "../../common/utils/guards/IsException"
import { SubscribedGames } from "../static/messages/GameSubscriptions"

export const getSubscribedGamesControllerFactory = (gamesService: GamesService) => async (ctx: Context) => {

  const games = await gamesService.getSubscribedGames(ctx.chat?.id as unknown as string)
  if (isException(games)) {
    await ctx.sendMessage(games.message)  
    return
  }
  
  await ctx.sendMessage(SubscribedGames(games))
}