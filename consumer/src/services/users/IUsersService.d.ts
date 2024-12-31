import { UserDto } from "../../shared/dto/User"
import { Exception } from "../../shared/utils/types/Exception"
import { User } from "../../models/User"

export type UsersSubscriptionsIdentifiers = {
  teamOneId: number
  teamTwoId: number
  gameId: number
}

export interface IUsersService {
  getUserById(id: string): Promise<User | Exception>
  createUser(user: UserDto): Promise<Exception | void>
  getTeamSubscribers(teamId: number): Promise<Exception | UserDto[]>
  getGameSubscribers(gameId: number): Promise<Exception | UserDto[]>
  getSubscribers(ids: UsersSubscriptionsIdentifiers): Promise<Exception | UserDto[]>
}