import { UserDto } from "../../common/dto/User"
import { Exception } from "../../common/utils/types/Exception"
import { User } from "../../models/User"

export interface IUsersService {
  getUserById(id: string): Promise<User | Exception>
  createUser(user: UserDto): Promise<Exception | void>
  getTeamSubscribers(teamId: number): Promise<Exception | UserDto[]>
  getGameSubscribers(gameId: number): Promise<Exception | UserDto[]>
}