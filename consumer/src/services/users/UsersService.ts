import { withExceptionCatch } from "../../common/decorators/WithExceptionCatch";
import { UserDto } from "../../common/dto/User";
import { USER_ALREADY_REGISTERED, USER_NOT_FOUND } from "../../common/exceptions/UserExceptions";
import { Exception } from "../../common/utils/types/Exception";
import { User } from "../../models/User";

export class UsersService {
  constructor(private model: typeof User) {}

  @withExceptionCatch
  public async getUserById(id: string): Promise<User | Exception> {
    const user = await this.model.findByPk(id)

    if (user == null) return USER_NOT_FOUND
    
    return user
  }

  @withExceptionCatch
  public async createUser(user: UserDto): Promise<Exception | void> {
    if (await this.model.findByPk(user.id)) return USER_ALREADY_REGISTERED
    await this.model.create(user)
  }
}