import { Context, Markup, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { UsersService } from "../services/users/UsersService";
import { isException } from "../common/utils/guards/IsException";
import { OpenMenu, UserCreated, Menu } from "./static/messages/Messages";
import { menuActionsKeyboard, openMenuKeyboard } from "./static/markups/MenuMarkups";
import { SubscriptionsService } from "../services/subscriptions/SubscriptionsService";
import { GameSubscription } from "../models/Subscriptions";

export const bindCommands = (
  bot: Telegraf<Context<Update>>, 
  usersService: UsersService,
  subscriptionsService: SubscriptionsService
): void => {
  bot.command('start', async (ctx) => {
    await ctx.sendMessage(OpenMenu(), openMenuKeyboard)
  })

  bot.command('menu', async (ctx) => {
    const userId = ctx.chat.id.toString()
    const gamesSubscriptions = await subscriptionsService.getGamesSubscriptionsByUserId(userId)
    if (isException(gamesSubscriptions) && gamesSubscriptions.critical) {
      await ctx.sendMessage(gamesSubscriptions.message)
      return
    }
    await ctx.sendMessage(Menu({
      gamesSubscriptionsCount: (gamesSubscriptions as GameSubscription[]).length,
      teamsSubscriptionsCount: 0,
      telegramUsername: ctx.from.username as string
    }), menuActionsKeyboard)
  })
}