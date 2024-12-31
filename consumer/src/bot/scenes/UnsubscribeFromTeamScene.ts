import { Markup, Scenes } from "telegraf";
import { ISubscriptionsService } from "../../services/subscriptions/ISubscriptionsService";
import { UNSUBSCRIBE_FROM_TEAM } from "../static/actions/ScenesActions";
import { isException } from "../../shared/utils/guards/ExceptionGuard";
import { actionExitMarkup } from "../static/markups/CommonMarkups";
import { CancellingInteraction, EnterPositionFromList } from "../static/messages/SharedMessages";
import { ITeamsService } from "../../services/teams/ITeamsService";
import { NoSubscribedTeams, TeamsToUnsubscribe, UnsubscribedFromTeam } from "../static/messages/TeamSubscriptionsMessages";

export const unsubscribeFromTeamScene = (
  teamsService: ITeamsService,
  subscriptionsService: ISubscriptionsService,
) => {
  const scene = new Scenes.WizardScene<Scenes.WizardContext>(UNSUBSCRIBE_FROM_TEAM,
    async (ctx) => {
      const teams = await teamsService.getSubscribedTeams(ctx.message?.chat.id as unknown as string)
      if (isException(teams)) {
        await ctx.sendMessage(teams.message, Markup.removeKeyboard())  
        await ctx.scene.leave()
        return
      }

      if (!teams.length) {
        await ctx.sendMessage(NoSubscribedTeams(), Markup.removeKeyboard())  
        await ctx.scene.leave()
        return
      }

      (ctx.wizard.state as any).teams = teams

      await ctx.sendMessage(TeamsToUnsubscribe(teams), actionExitMarkup)
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

      const deleteState = await subscriptionsService.deleteTeamSubscription(selectedTeam.id)
      if (isException(deleteState)) {
        await ctx.sendMessage(deleteState.message, Markup.removeKeyboard())  
        await ctx.scene.leave()
        return
      }

      await ctx.sendMessage(UnsubscribedFromTeam(), Markup.removeKeyboard())
      await ctx.scene.leave()
    }
  )

  return scene
}

