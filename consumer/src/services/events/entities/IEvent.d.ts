import { BareGame } from "../../../shared/dto/Game"

export type EventDtoSharedFields = {
  game: BareGame
}

export interface IEvent {
  get eventId(): string
  get teamHomeId(): number
  get teamAwayId(): number
  get gameId(): number
}
