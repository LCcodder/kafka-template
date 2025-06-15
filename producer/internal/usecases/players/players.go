package players_usecases

import (
	"example.com/m/v2/internal/adapters/repositories"
	"example.com/m/v2/internal/shared/dto"
	"example.com/m/v2/internal/shared/exceptions"
	teams_usecases "example.com/m/v2/internal/usecases/teams"
)

type PlayersUseCases struct {
	r   *repositories.PlayersRepository
	tuc teams_usecases.TeamsUseCases
}

func NewPlayersUseCases(r *repositories.PlayersRepository, tuc *teams_usecases.TeamsUseCases) *PlayersUseCases {
	return &PlayersUseCases{
		r:   r,
		tuc: *tuc,
	}
}

func (uc *PlayersUseCases) CreatePlayer(p *dto.Player) (*dto.Player, *exceptions.Exception) {
	_, exc := uc.tuc.GetTeamById(p.TeamID)
	if exc != nil {
		return nil, exc
	}

	id, err := uc.r.Insert(p)
	if err != nil {
		return nil, &exceptions.ExcDatabaseError
	}

	p.ID = *id
	return p, nil
}

func (uc *PlayersUseCases) GetPlayerById(id int64) (*dto.Player, *exceptions.Exception) {
	player, err := uc.r.Get(id)
	if err != nil {
		return nil, &exceptions.ExcDatabaseError
	}

	if player == nil {
		return nil, &exceptions.ExcPlayerNotFound
	}

	return player, nil
}

func (uc *PlayersUseCases) GetPlayersByTeamId(id int64) (*[]dto.Player, *exceptions.Exception) {
	_, exc := uc.tuc.GetTeamById(id)
	if exc != nil {
		return nil, exc
	}

	players, err := uc.r.GetAllByTeamId(id)
	if err != nil {
		return nil, &exceptions.ExcDatabaseError
	}

	if len(*players) == 0 {
		return &[]dto.Player{}, nil
	}

	return players, nil
}
