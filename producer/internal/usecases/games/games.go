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

func (uc *GamesUseCases) CreateGame(g *dto.Game) (*dto.Game, *exceptions.Exception) {
	exc := uc.checkTeamsExistance(g)
	if exc != nil {
		return nil, exc
	}

	// nullifying to default values
	g.TeamHomeScore = 0
	g.TeamAwayScore = 0
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

	updatedGame, _ := uc.GetGameById(id)

	return updatedGame, nil
}

func (uc *GamesUseCases) UpdateScore(id int64, teamScoredID int64, increment uint) (*dto.Game, *exceptions.Exception) {
	game, exc := uc.GetGameById(id)
	if exc != nil {
		return nil, exc
	}

	data := dto.UpdateGame{}

	if game.TeamHomeID == teamScoredID {
		data.TeamHomeScore = game.TeamHomeScore + increment
	} else {
		data.TeamHomeScore = game.TeamHomeScore + increment
	}

	err := uc.r.Update(id, data)
	if err != nil {
		return nil, &exceptions.ExcDatabaseError
	}

	updatedGame, _ := uc.GetGameById(id)
	return updatedGame, nil
}

func (uc *GamesUseCases) CloseGame(id int64) *exceptions.Exception {
	game, exc := uc.GetGameById(id)
	if exc != nil {
		return exc
	}

	if game.IsEnded {
		return &exceptions.ExcGameAlreadyClosed
	}

	err := uc.r.CloseGame(id)
	if err != nil {
		return &exceptions.ExcDatabaseError
	}

	return nil
}
