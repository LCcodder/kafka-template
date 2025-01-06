import { Context, MiddlewareFn } from "telegraf";
import { UsersService } from "../../services/users/UsersService";

export const signUpMiddleware = (usersService: UsersService): MiddlewareFn<Context> => async (ctx: Context, next: () => Promise<void>) => {
  await usersService.createUser({ id: ctx.chat?.id.toString() as string })
  next()
}
