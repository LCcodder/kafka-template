import { FoulDto, ScoreDto, SubstitutionDto } from "../../../shared/dto/Events";
import { Message } from "../../../shared/utils/types/Message";

export const ScoreEventMessage = (score: ScoreDto): Message => `
${score.team_scored.name}'s player ${score.player_scored.first_name} ${score.player_scored.last_name} scored ${score.points} points!

Quarter: ${score.quarter} (${score.time})
`

export const FoulEventMessage = (foul: FoulDto): Message => `
${foul.by_team.name}'s player ${foul.by_player.first_name} ${foul.by_player.last_name} fouled (${foul.type} foul) on ${foul.on_player.first_name} ${foul.on_player.last_name}

Quarter: ${foul.quarter} (${foul.time})
`

export const SubstitutionEventMesssage = (substitution: SubstitutionDto) => `
${substitution.in_team.name} replaced ${substitution.whom_player.first_name} ${substitution.whom_player.last_name} to ${substitution.to_player.first_name} ${substitution.to_player.last_name}

Quarter: ${substitution.quarter} (${substitution.time})
`