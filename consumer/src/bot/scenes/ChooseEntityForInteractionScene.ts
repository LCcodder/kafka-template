import { Markup, Scenes } from "telegraf"
import { CancellingInteraction, ChooseCorrectEntity, ChooseEntity } from "../static/messages/SharedMessages"
import { chooseEntityMarkup } from "../static/markups/Markups"

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
          await ctx.scene.leave()
          await ctx.sendMessage(CancellingInteraction(), Markup.removeKeyboard());
          return
          
        case "game":
          await ctx.scene.leave()
          await ctx.scene.enter(gameInteractionSceneId)
          return
          
        case "team":
          await ctx.scene.leave()
          await ctx.scene.enter(teamInteractionSceneId)
          return
          
        default:
          await ctx.sendMessage(ChooseCorrectEntity());          
      } 
    }
  )

  return scene
}