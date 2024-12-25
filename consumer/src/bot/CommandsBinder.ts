import { Scenes, Telegraf } from "telegraf";
import { SUBSCRIBE, UNSUBSCRIBE } from "./static/actions/ScenesActions";
import { Controllers } from "./controllers/ControllersFactory";



export const bindCommands = (
  bot: Telegraf<Scenes.WizardContext<Scenes.WizardSessionData>>, 
  controllers: Controllers
): void => {
  bot.command('start', controllers.menu)
  bot.command('menu', controllers.menu)

  bot.command('subscribe', (ctx) => ctx.scene.enter(SUBSCRIBE))
  bot.command('unsubscribe', (ctx) => ctx.scene.enter(UNSUBSCRIBE))
  bot.command("mygames", controllers.getSubscribedGames)
  bot.command("myteams", controllers.getSubscribedTeams)
}