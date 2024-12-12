import { Context, Markup, Scenes, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { UsersService } from "../services/users/UsersService";
import { isException } from "../common/utils/guards/IsException";
import { OpenMenu, UserCreated, Menu } from "./static/messages/Messages";
import { menuActionsKeyboard, openMenuKeyboard } from "./static/markups/MenuMarkups";
import { SubscriptionsService } from "../services/subscriptions/SubscriptionsService";
import { GameSubscription } from "../models/Subscriptions";



export const bindCommands = (
  bot: Telegraf<Scenes.SceneContext<Scenes.SceneSessionData>>, 
  usersService: UsersService,
  subscriptionsService: SubscriptionsService
): void => {

  const MenuHandler = async (ctx: Context) => {
    ctx.deleteMessage(ctx.message?.message_id)

    const userId = ctx.chat?.id.toString() as string
    const gamesSubscriptions = await subscriptionsService.getGamesSubscriptionsByUserId(userId)
    if (isException(gamesSubscriptions) && gamesSubscriptions.critical) {
      await ctx.sendMessage(gamesSubscriptions.message)
      return
    }
    await ctx.sendMessage(Menu({
      gamesSubscriptionsCount: (gamesSubscriptions as GameSubscription[]).length,
      teamsSubscriptionsCount: 0,
      telegramUsername: ctx.from?.username as string
    }), menuActionsKeyboard)
  }

  bot.command('start', async (ctx) => {
    await ctx.sendMessage(OpenMenu(), openMenuKeyboard)
  })


  bot.action("menu", MenuHandler)

  bot.action("games_subscriptions_menu", (ctx) => ctx.scene.enter('games_subscriptions_menu'))
}