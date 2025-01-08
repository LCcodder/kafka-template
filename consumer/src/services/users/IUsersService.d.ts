import { UserDto } from "../../shared/dto/User"
import { Exception } from "../../shared/utils/types/Exception"
import { User } from "../../models/User"

export type UsersSubscriptionsIdentifiers = {
  teamHomeId: number
  teamAwayId: number
  gameId: number
}

export interface IUsersService {
  getUserById(id: string): Promise<User | Exception>
  createUser(user: UserDto): Promise<Exception | void>
  getSubscribers(ids: UsersSubscriptionsIdentifiers): Promise<Exception | UserDto[]>
}