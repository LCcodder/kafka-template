import { Context } from "telegraf"
import { isException } from "../../common/utils/guards/IsException"
import { ITeamsService } from "../../services/teams/ITeamsService"
import { NoSubscribedTeams, SubscribedTeams } from "../static/messages/TeamSubscriptionsMessages"

export const getSubscribedTeamsControllerFactory = (teamsService: ITeamsService) => async (ctx: Context) => {

  const teams = await teamsService.getSubscribedTeams(ctx.chat?.id as unknown as string)
  if (isException(teams)) {
    await ctx.sendMessage(teams.message)  
    return
  }

  if (!teams.length) {
    await ctx.sendMessage(NoSubscribedTeams())
    return
  }
  
  await ctx.sendMessage(SubscribedTeams(teams))
}