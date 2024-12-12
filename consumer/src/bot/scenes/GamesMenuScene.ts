import { Scenes } from "telegraf"
import { GamesService } from "../../services/games/GamesService"
import { SubscriptionsService } from "../../services/subscriptions/SubscriptionsService"
import { isException } from "../../common/utils/guards/IsException"
import { GamesToSubscribe, SubscribedGames } from "../static/messages/Messages"
import { gamesMenuKeyboard, inactionKeyboard } from "../static/markups/GamesMenuMarkups"

export const initGamesMenuScene = (
  gamesService: GamesService,
  subscriptionsService: SubscriptionsService
) => {
  const gamesScene = new Scenes.BaseScene<Scenes.SceneContext>("games_subscriptions_menu")

  gamesScene.enter(async (ctx) => {
    await ctx.deleteMessage(ctx.message?.message_id)

    const games = await gamesService.getSubscribedGames(ctx.chat?.id as unknown as string)
    if (isException(games)) {
      await ctx.sendMessage(games.message)  
      return
    }
    
    (ctx.session as any).myData = {}
    await ctx.sendMessage(SubscribedGames(games), gamesMenuKeyboard)
  })

  gamesScene.action('choose_game_to_subscribe', async (ctx) => {
    const games = await gamesService.getGamesInProgress()
    if (isException(games)) {
      await ctx.sendMessage(games.message)  
      return
    }

    (ctx.session as any).myData.games = games

    await ctx.sendMessage(GamesToSubscribe(games), inactionKeyboard)
  })

  gamesScene.action('subscribe_to_game', async (ctx) => {

  })

  gamesScene.action('unsubscribe_from_game', async (ctx) => {

  })

  return gamesScene
}