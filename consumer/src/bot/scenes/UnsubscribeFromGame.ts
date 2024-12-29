import { Markup, Scenes } from "telegraf";
import { ISubscriptionsService } from "../../services/subscriptions/ISubscriptionsService";
import { UNSUBSCRIBE_FROM_GAME } from "../static/actions/ScenesActions";
import { isException } from "../../common/utils/guards/ExceptionGuard";
import { IGamesService } from "../../services/games/IGamesService";
import { NoSubscribedGames, GamesToUnsubscribe, UnsubscribedFromGame } from "../static/messages/GameSubscriptionsMessages";
import { actionExitMarkup } from "../static/markups/CommonMarkups";
import { CancellingInteraction, EnterPositionFromList } from "../static/messages/SharedMessages";

export const unsubscribeFromGameScene = (
  gamesService: IGamesService,
  subscriptionsService: ISubscriptionsService,
) => {
  const scene = new Scenes.WizardScene<Scenes.WizardContext>(UNSUBSCRIBE_FROM_GAME,
    async (ctx) => {
      const games = await gamesService.getSubscribedGames(ctx.message?.chat.id as unknown as string)
      if (isException(games)) {
        await ctx.sendMessage(games.message, Markup.removeKeyboard())  
        await ctx.scene.leave()
        return
      }

      if (!games.length) {
        await ctx.sendMessage(NoSubscribedGames(), Markup.removeKeyboard())  
        await ctx.scene.leave()
        return
      }

      (ctx.wizard.state as any).games = games

      await ctx.sendMessage(GamesToUnsubscribe(games), actionExitMarkup)
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

      const deleteState = await subscriptionsService.deleteGameSubscription(selectedGame.id)
      if (isException(deleteState)) {
        await ctx.sendMessage(deleteState.message, Markup.removeKeyboard())  
        await ctx.scene.leave()
        return
      }

      await ctx.sendMessage(UnsubscribedFromGame(), Markup.removeKeyboard())
      await ctx.scene.leave()
    }
  )

  return scene
}

