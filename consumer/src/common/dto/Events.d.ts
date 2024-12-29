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

type QuarterAndTime = {
  quarter: number
  time: string
}

export type ScoreDto = {
  id: string
  game: Game,
  player_scored: Player
  team_scored: Team
  points: number
} & QuarterAndTime


export type SubstitutionDto = {
  id: string
  game: Game
  whom_player: Player
  to_player: Player
  in_team: Team
} & QuarterAndTime

export type FoulDto = {
  id: string
  game: Game
  type: string
  on_player: Player
  by_player: Player
  by_team: Team
} & QuarterAndTime