package games_usecases

import (
	"time"

	"example.com/m/v2/internal/repositories"
	"example.com/m/v2/internal/shared/dto"
	"example.com/m/v2/internal/shared/exceptions"
	teams_usecases "example.com/m/v2/internal/usecases/teams"
)

type GamesUseCases struct {
	r   *repositories.GamesRepository
	tuc teams_usecases.TeamsUseCases
}

func NewGamesUseCases(r *repositories.GamesRepository, tuc *teams_usecases.TeamsUseCases) *GamesUseCases {
	return &GamesUseCases{
		r:   r,
		tuc: *tuc,
	}
}

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

func (uc *GamesUseCases) CreateGame(g *dto.Game) (*dto.Game, *exceptions.Exception) {
	exc := uc.checkTeamsExistance(g)
	if exc != nil {
		return nil, exc
	}

	// nullifying to default values
	g.TeamOneScore = 0
	g.TeamTwoScore = 0
	g.IsEnded = false
	g.CreatedAt = time.Now().UTC().Format("2006-01-02 15:04:05")
	g.UpdatedAt = time.Now().UTC().Format("2006-01-02 15:04:05")

	id, err := uc.r.Insert(g)
	if err != nil {
		return nil, &exceptions.ExcDatabaseError
	}

	g.ID = *id
	return g, nil
}

func (uc *GamesUseCases) GetGameById(id int64) (*dto.Game, *exceptions.Exception) {
	game, err := uc.r.Get(id)
	if err != nil {
		return nil, &exceptions.ExcDatabaseError
	}

	if game == nil {
		return nil, &exceptions.ExcGameNotFound
	}

	return game, nil
}

func (uc *GamesUseCases) UpdateGameData(id int64, g *dto.UpdateGame) (*dto.Game, *exceptions.Exception) {
	_, exc := uc.GetGameById(id)
	if exc != nil {
		return nil, exc
	}

	g.UpdatedAt = time.Now().UTC().Format("2006-01-02 15:04:05")

	err := uc.r.Update(id, *g)
	if err != nil {
		return nil, &exceptions.ExcDatabaseError
	}

	updatedUser, _ := uc.GetGameById(id)

	return updatedUser, nil
}
