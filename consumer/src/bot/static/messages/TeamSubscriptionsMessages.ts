import { SubscribedTeam } from "../../../common/dto/Team";
import { Message } from "../../../common/utils/types/Message";
import { Team } from "../../../models/Team";

export const NoTeamsToSubscribe = (): Message => "There are no teams to subscribe ❌"

export const TeamsToSubscribe = (teams: Team[]): Message => {
  let message = "Enter position of team to subscribe 🔔:\n"

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i]
    message += `➡️ ${i+1}: ${team.name}\n`
  }
  return message
}

export const TeamsToUnsubscribe = (teams: SubscribedTeam[]): Message => {
  let message = "Enter position of team to unsubscribe 🔕:\n"

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i]
    message += `➡️ ${i+1}: ${team.name}\n`
  }
  return message
}

export const SubscribedTeams = (teams: SubscribedTeam[]): Message => {
  let message = "Your teams 🛎️:\n"
  for (const team of teams) {
    message += `➡️ ${team.name}\n`
  }
  return message
}

export const NoSubscribedTeams = (): Message => "You haven't subscribed to any team events ❌\n/subscribe - to subscribe to events"

export const SubscribedToTeam = (): Message => "Successfully subscribed to team events ✅"

export const UnsubscribedFromTeam = (): Message => "Successfully unsubscribed from team events ✅"