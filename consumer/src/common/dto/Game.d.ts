import { Game } from "../../models/Game"

// in sql query game id replaced by subscription id
export type SubscribedGame = Game & {
  team_one_name: string
  team_two_name: string
}