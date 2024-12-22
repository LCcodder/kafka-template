import { Context, Markup, Scenes, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { UsersService } from "../services/users/UsersService";
import { isException } from "../common/utils/guards/IsException";
import { SubscriptionsService } from "../services/subscriptions/SubscriptionsService";
import { GameSubscription } from "../models/Subscriptions";
import { menuControllerFactory } from "./controllers/Menu";
import { getSubscribedGamesControllerFactory } from "./controllers/GetSubscribedGames";
import { GamesService } from "../services/games/GamesService";



export const bindCommands = (
  bot: Telegraf<Scenes.WizardContext<Scenes.WizardSessionData>>, 
  usersService: UsersService,
  gamesService: GamesService,
  subscriptionsService: SubscriptionsService
): void => {

  bot.command('start', menuControllerFactory(gamesService))
  bot.command("subscribed_games", getSubscribedGamesControllerFactory(gamesService))
  bot.command("subscribe_to_game", (ctx) => ctx.scene.enter('subscribe_game'))
}