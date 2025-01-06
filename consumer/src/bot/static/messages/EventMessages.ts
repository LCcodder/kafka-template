import { BareGame as Game } from "../../../shared/dto/Game"
import { BareTeam as Team } from "../../../shared/dto/Team"

import { FoulDto, ScoreDto, SubstitutionDto } from "../../../shared/dto/Events";
import { Message } from "../../../shared/utils/types/Message";

const getScore = (teamOne: Team, teamTwo: Team, game: Game): string => {
  if (game.team_one_id === teamOne.id) {
    return `🏀 ${teamOne.name} VS ${teamTwo.name} (${game.team_one_score} : ${game.team_two_score})`
  }
  return `🏀 ${teamOne.name} VS ${teamTwo.name} (${game.team_two_score} : ${game.team_one_score})`
}

export const ScoreEventMessage = (score: ScoreDto): Message => `
🔔 ${score.this_team.name}'s player ${score.player_scored.first_name} ${score.player_scored.last_name} scored ${score.points} points!

${getScore(score.this_team, score.opposing_team, score.game)}
⏱️ Quarter: ${score.quarter} (${score.time})
`

export const FoulEventMessage = (foul: FoulDto): Message => `
🔔 ${foul.this_team.name}'s player ${foul.by_player.first_name} ${foul.by_player.last_name} fouled (${foul.type} foul) on ${foul.on_player.first_name} ${foul.on_player.last_name}

${getScore(foul.this_team, foul.opposing_team, foul.game)}
⏱️ Quarter: ${foul.quarter} (${foul.time})
`

export const SubstitutionEventMesssage = (substitution: SubstitutionDto) => `
🔔 ${substitution.this_team.name} replaced ${substitution.whom_player.first_name} ${substitution.whom_player.last_name} to ${substitution.to_player.first_name} ${substitution.to_player.last_name}

${getScore(substitution.this_team, substitution.opposing_team, substitution.game)}
⏱️ Quarter: ${substitution.quarter} (${substitution.time})
`