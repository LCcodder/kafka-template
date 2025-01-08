package games_usecases

import (
	"example.com/m/v2/internal/shared/dto"
	"example.com/m/v2/internal/shared/exceptions"
)

func (uc *GamesUseCases) checkTeamsExistance(g *dto.Game) *exceptions.Exception {
	if g.TeamHomeID == g.TeamAwayID {
		return &exceptions.ExcTeamNotFound
	}
	if _, exc := uc.tuc.GetTeamById(g.TeamHomeID); exc != nil {
		return exc
	}
	if _, exc := uc.tuc.GetTeamById(g.TeamAwayID); exc != nil {
		return exc
	}

	return nil
}
