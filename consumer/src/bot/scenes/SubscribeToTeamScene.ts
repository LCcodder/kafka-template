import { Markup, Scenes } from "telegraf";
import { ISubscriptionsService } from "../../services/subscriptions/ISubscriptionsService";
import { SUBSCRIBE_TO_TEAM } from "../static/actions/ScenesActions";
import { ITeamsService } from "../../services/teams/ITeamsService";
import { isException } from "../../common/utils/guards/ExceptionGuard";
import { NoTeamsToSubscribe, SubscribedToTeam, TeamsToSubscribe } from "../static/messages/TeamSubscriptionsMessages";
import { actionExitMarkup } from "../static/markups/CommonMarkups";
import { CancellingInteraction, EnterPositionFromList } from "../static/messages/SharedMessages";

export const subscribeToTeamScene = (
  teamsService: ITeamsService,
  subscriptionsService: ISubscriptionsService,
) => {
  const scene = new Scenes.WizardScene<Scenes.WizardContext>(SUBSCRIBE_TO_TEAM,
    async (ctx) => {
      const teams = await teamsService.getTeams()
      if (isException(teams)) {
        await ctx.sendMessage(teams.message, Markup.removeKeyboard())  
        await ctx.scene.leave()
        return
      }

      if (!teams.length) {
        await ctx.sendMessage(NoTeamsToSubscribe(), Markup.removeKeyboard())  
        await ctx.scene.leave()
        return
      }

      (ctx.wizard.state as any).teams = teams

      await ctx.sendMessage(TeamsToSubscribe(teams), actionExitMarkup)
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

      const selectedTeam = (ctx.wizard.state as any).teams[msg - 1]
      if (!selectedTeam) {
        await ctx.sendMessage(EnterPositionFromList())
        return
      }

      const createdSubscription = await subscriptionsService.createTeamSubscription({
        user_id: ctx.message?.chat.id as unknown as string,
        team_id: selectedTeam.id
      })
      if (isException(createdSubscription)) {
        await ctx.sendMessage(createdSubscription.message, Markup.removeKeyboard())  
        await ctx.scene.leave()
        return
      }

      await ctx.sendMessage(SubscribedToTeam(), Markup.removeKeyboard())
      await ctx.scene.leave()
    }
  )

  return scene
}