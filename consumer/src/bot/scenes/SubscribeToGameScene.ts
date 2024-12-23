import { Markup, Scenes } from "telegraf"
import { GamesService } from "../../services/games/GamesService"
import { SubscriptionsService } from "../../services/subscriptions/SubscriptionsService"
import { isException } from "../../common/utils/guards/IsException"
import { actionExitMarkup } from "../static/markups/CommonMarkups"
import { GamesToSubscribe, NoGamesToSubscribe, SubscibedToGame } from "../static/messages/GameSubscriptionsMessages"
import { CancellingSubscription, EnterPositionFromList } from "../static/messages/SharedMessages"
import { SUBSCRIBE_TO_GAME } from "../static/actions/ScenesActions"

export const subscribeToGameScene = (
  gamesService: GamesService,
  subscriptionsService: SubscriptionsService
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