import { Game } from "../../models/Game"

export type GameWithTeamNames = Game & {
  team_one_name: string
  team_two_name: string
}