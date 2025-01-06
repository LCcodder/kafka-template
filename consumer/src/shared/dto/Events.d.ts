import { BareGame as Game } from "./Game"
import { BareTeam as Team } from "./Team"

type Player = {
  id: number
  first_name: string
  last_name: string
  number: number
  position: string
  team_id: number
}

type EventDto<T> = {
  quarter: number
  time: string

  this_team: Team
  opposing_team: Team
} & T

export type ScoreDto = EventDto<{
  id: string
  game: Game,
  player_scored: Player  
  points: number
}>


export type SubstitutionDto = EventDto<{
  id: string
  game: Game
  whom_player: Player
  to_player: Player
}>

export type FoulDto = EventDto<{
  id: string
  game: Game
  type: string
  on_player: Player
  by_player: Player
}>