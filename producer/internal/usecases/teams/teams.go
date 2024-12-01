package teams_usecases

import (
	"example.com/m/v2/internal/repositories"
	"example.com/m/v2/internal/shared/dto"
	"example.com/m/v2/internal/shared/exceptions"
)

type TeamsUseCases struct {
	r *repositories.TeamsRepository
}

func NewTeamsUseCases(r *repositories.TeamsRepository) *TeamsUseCases {
	return &TeamsUseCases{
		r: r,
	}
}

func (uc *TeamsUseCases) CreateTeam(t *dto.Team) (*dto.Team, *exceptions.Exception) {
	id, err := uc.r.Insert(t)
	if err != nil {
		return nil, &exceptions.ExcDatabaseError
	}

	t.ID = *id
	return t, nil
}

func (uc *TeamsUseCases) GetTeamById(id int64) (*dto.Team, *exceptions.Exception) {
	team, err := uc.r.Get(id)
	if err != nil {
		return nil, &exceptions.ExcDatabaseError
	}

	if team == nil {
		return nil, &exceptions.ExcTeamNotFound
	}

	return team, nil
}
