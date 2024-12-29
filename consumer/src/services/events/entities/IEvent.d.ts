import { BareGame } from "../../../common/dto/Game"

export type EventDtoSharedFields = {
  game: BareGame
}

export interface IEvent {
  get eventId(): string
  get teamOneId(): number
  get teamTwoId(): number
  get gameId(): number
}
