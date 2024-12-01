package games_usecases

import (
	"example.com/m/v2/internal/shared/dto"
	"example.com/m/v2/internal/shared/exceptions"
)

func (uc *GamesUseCases) checkTeamsExistance(g *dto.Game) *exceptions.Exception {
	if g.TeamOneID == g.TeamTwoID {
		return &exceptions.ExcTeamNotFound
	}
	if _, exc := uc.tuc.GetTeamById(g.TeamOneID); exc != nil {
		return exc
	}
	if _, exc := uc.tuc.GetTeamById(g.TeamTwoID); exc != nil {
		return exc
	}

	return nil
}
