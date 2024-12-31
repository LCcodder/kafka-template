import { isException } from "../../shared/utils/guards/ExceptionGuard";
import { Context } from "telegraf";
import { SubscribedGame } from "../../shared/dto/Game";
import { Menu } from "../static/messages/MenuMessages";
import { IGamesService } from "../../services/games/IGamesService";
import { ITeamsService } from "../../services/teams/ITeamsService";
import { SubscribedTeam } from "../../shared/dto/Team";

export const menuControllerFactory = (
  gamesService: IGamesService,
  teamsService: ITeamsService
) => 
  async (ctx: Context) => {

  const userId = ctx.chat?.id.toString() as string
  const subscribedGames = await gamesService.getSubscribedGames(userId) as SubscribedGame[]
  if (isException(subscribedGames) && subscribedGames.critical) {
    await ctx.sendMessage(subscribedGames.message)
    return
  }
  
  const subscribedTeams = await teamsService.getSubscribedTeams(userId) as SubscribedTeam[]
  if (isException(subscribedTeams) && subscribedTeams.critical) {
    await ctx.sendMessage(subscribedTeams.message)
    return
  }

  await ctx.sendMessage(Menu({
    gamesSubscriptionsCount: subscribedGames.length,
    teamsSubscriptionsCount: subscribedTeams.length,
    telegramUsername: ctx.from?.username as string
  }))
}