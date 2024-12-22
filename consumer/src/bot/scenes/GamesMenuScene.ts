import { Markup, Scenes } from "telegraf"
import { GamesService } from "../../services/games/GamesService"
import { SubscriptionsService } from "../../services/subscriptions/SubscriptionsService"
import { isException } from "../../common/utils/guards/IsException"
import { actionExitMarkup } from "../static/markups/CommonMarkups"
import { GamesToSubscribe, SubscibedToGame } from "../static/messages/GameSubscriptions"
import { CancellingSubscription, EnterPositionFromList } from "../static/messages/Shared"

export const subscribeToGameScene = (
  gamesService: GamesService,
  subscriptionsService: SubscriptionsService
) => {
  const scene = new Scenes.WizardScene<Scenes.WizardContext>('subscribe_game', 
    async (ctx) => {
      const games = await gamesService.getGamesInProgress()
      if (isException(games)) {
        await ctx.sendMessage(games.message)  
        await ctx.scene.leave()
        return
      }
  
      (ctx.wizard.state as any).games = games
  
      await ctx.sendMessage(GamesToSubscribe(games), actionExitMarkup)
      return ctx.wizard.next();
    },
    async (ctx) => {
      // @ts-ignore
      const msg = ctx.message?.text

      if (msg === "Exit") {
        await ctx.sendMessage(CancellingSubscription(), Markup.removeKeyboard());
        await ctx.scene.leave()
        return
      }

      const selectedGame = (ctx.wizard.state as any).games[msg - 1]
      if (!selectedGame) {
        await ctx.sendMessage(EnterPositionFromList())
        return
      }

      const createdSubscription = await subscriptionsService.createGameSubscription({
        user_id: ctx.message?.chat.id.toString() as string,
        game_id: selectedGame.id
      })
      if (isException(createdSubscription)) {
        await ctx.sendMessage(createdSubscription.message)  
        await ctx.scene.leave()
        return
      }
      
      await ctx.sendMessage(SubscibedToGame())
      await ctx.scene.leave()
    },
  )

  return scene
}