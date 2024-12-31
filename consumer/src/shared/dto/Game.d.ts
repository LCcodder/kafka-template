import { Game } from "../../models/Game"

// in sql query game id replaced by subscription id
export type SubscribedGame = Game & {
  team_one_name: string
  team_two_name: string
}

export type BareGame = Pick<Game, 
"updated_at" | 
"created_at"|
"team_one_score" | 
"team_two_score" | 
"team_one_id" | 
"team_two_id" |
"is_ended" |
"id"
>