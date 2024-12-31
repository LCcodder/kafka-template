import { Markup, Scenes } from "telegraf"
import { isException } from "../../shared/utils/guards/ExceptionGuard"
import { actionExitMarkup } from "../static/markups/CommonMarkups"
import { GamesToSubscribe, NoGamesToSubscribe, SubscribedToGame } from "../static/messages/GameSubscriptionsMessages"
import { CancellingInteraction, EnterPositionFromList } from "../static/messages/SharedMessages"
import { SUBSCRIBE_TO_GAME } from "../static/actions/ScenesActions"
import { ISubscriptionsService } from "../../services/subscriptions/ISubscriptionsService"
import { IGamesService } from "../../services/games/IGamesService"

export const subscribeToGameScene = (
  gamesService: IGamesService,
  subscriptionsService: ISubscriptionsService
) => {
  const scene = new Scenes.WizardScene<Scenes.WizardContext>(SUBSCRIBE_TO_GAME, 
    async (ctx) => {
      const games = await gamesService.getGamesInProgress()
      if (isException(games)) {
        await ctx.sendMessage(games.message, Markup.removeKeyboard())  
        await ctx.scene.leave()
        return
      }
      
      if (!games.length) {
        await ctx.sendMessage(NoGamesToSubscribe(), Markup.removeKeyboard())  
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
        await ctx.sendMessage(CancellingInteraction(), Markup.removeKeyboard());
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
        await ctx.sendMessage(createdSubscription.message, Markup.removeKeyboard())  
        await ctx.scene.leave()
        return
      }
      
      await ctx.sendMessage(SubscribedToGame(), Markup.removeKeyboard())
      await ctx.scene.leave()
    },
  )

  return scene
}