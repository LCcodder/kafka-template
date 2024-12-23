import { Markup, Scenes } from "telegraf"
import { CancellingInteraction, ChooseCorrectEntity, ChooseEntity } from "../static/messages/SharedMessages"
import { chooseEntityMarkup } from "../static/markups/CommonMarkups"

export const chooseEntityForInteractionScene = (
  targetSceneId: string, 
  gameInteractionSceneId: string,
  teamInteractionSceneId: string
) => {
  const scene = new Scenes.WizardScene<Scenes.WizardContext>(targetSceneId, 
    async (ctx) => {
      await ctx.sendMessage(ChooseEntity(), chooseEntityMarkup)
      ctx.wizard.next()
    },
    async (ctx) => {
      // @ts-ignore
      const msg = ctx.message?.text?.toLowerCase()

      switch (msg) {
        case "exit":
          await ctx.sendMessage(CancellingInteraction(), Markup.removeKeyboard());
          await ctx.scene.leave()
          return

        case "game":
          await ctx.scene.enter(gameInteractionSceneId)
          await ctx.scene.leave()
          return

        case "team":
          await ctx.scene.enter(teamInteractionSceneId)
          await ctx.scene.leave()
          return

        default:
          await ctx.sendMessage(ChooseCorrectEntity());
      }
      
    }

  )

  return scene
}