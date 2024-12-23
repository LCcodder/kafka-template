import { Context, Markup, Scenes, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { UsersService } from "../services/users/UsersService";
import { isException } from "../common/utils/guards/IsException";
import { SubscriptionsService } from "../services/subscriptions/SubscriptionsService";
import { GameSubscription } from "../models/Subscriptions";
import { menuControllerFactory } from "./controllers/Menu";
import { getSubscribedGamesControllerFactory } from "./controllers/GetSubscribedGames";
import { GamesService } from "../services/games/GamesService";
import { chooseEntityForInteractionScene } from "./scenes/ChooseEntityForInteractionScene";
import { SUBSCRIBE, SUBSCRIBE_TO_GAME } from "./static/actions/ScenesActions";



export const bindCommands = (
  bot: Telegraf<Scenes.WizardContext<Scenes.WizardSessionData>>, 
  usersService: UsersService,
  gamesService: GamesService,
  subscriptionsService: SubscriptionsService
): void => {

  bot.command('start', menuControllerFactory(gamesService))
  bot.command('subscribe', (ctx) => ctx.scene.enter(SUBSCRIBE))
  bot.command("mygames", getSubscribedGamesControllerFactory(gamesService))
}