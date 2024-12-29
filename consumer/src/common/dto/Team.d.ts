import { Team } from "../../models/Team"

export type SubscribedTeam = {
  // subscription id
  id: number
  name: string
}

export type BareTeam = Pick<Team, 
"id" |
"name"
>