import { Context } from "telegraf"
import { GamesService } from "../../services/games/GamesService"
import { SubscribedGames } from "../messages/Messages"
import { isException } from "../../common/utils/guards/IsException"

export const getSubscribedGamesControllerFactory = (gamesService: GamesService) => async (ctx: Context) => {
  await ctx.deleteMessage(ctx.message?.message_id)

  const games = await gamesService.getSubscribedGames(ctx.chat?.id as unknown as string)
  if (isException(games)) {
    await ctx.sendMessage(games.message)  
    return
  }
  
  await ctx.sendMessage(SubscribedGames(games))
}