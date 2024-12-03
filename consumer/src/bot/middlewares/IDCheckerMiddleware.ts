import { Context, Middleware, MiddlewareFn } from "telegraf";
import { UsersService } from "../../services/users/UsersService";
import { isException } from "../../common/utils/guards/IsException";
import { NotRegistered } from "../static/messages/Messages";

export const UserIDChecker = (usersService: UsersService): MiddlewareFn<Context> => async (ctx: Context, next: () => Promise<void>) => {
  await usersService.createUser({ id: ctx.chat?.id.toString() as string })
  next()
}
