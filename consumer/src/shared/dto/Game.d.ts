import { Game } from "../../models/Game"

// in sql query game id replaced by subscription id
export type SubscribedGame = Game & {
  team_home_name: string
  team_away_name: string
}

export type BareGame = Pick<Game, 
"updated_at" | 
"created_at"|
"team_home_score" | 
"team_away_score" | 
"team_home_id" | 
"team_away_id" |
"is_ended" |
"id"
>