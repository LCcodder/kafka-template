package repositories

import (
	"database/sql"
	"errors"
	"fmt"

	"example.com/m/v2/internal/shared/dto"
	"github.com/doug-martin/goqu/v9"
)

type TeamsRepository struct {
	db *sql.DB
}

func NewTeamsRepository(db *sql.DB) *TeamsRepository {
	return &TeamsRepository{
		db: db,
	}
}

func (r *TeamsRepository) Insert(p *dto.Team) (*int64, error) {
	query, _, _ := dialect.Insert("teams").Rows(*p).ToSQL()
	_, err := r.db.Exec(query)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	query = "SELECT LAST_INSERT_ID();"
	var id int64
	err = r.db.QueryRow(query).Scan(&id)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return &id, nil
}

func (r *TeamsRepository) Get(id int64) (*dto.Team, error) {
	query, _, _ := dialect.From("teams").Where(goqu.Ex{
		"id": id,
	}).ToSQL()

	var team dto.Team

	err := r.db.QueryRow(query).Scan(
		&team.ID,
		&team.Name,
	)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &team, nil
}

func (r *TeamsRepository) GetAll() (*[]dto.Team, error) {
	query, _, _ := dialect.From("teams").ToSQL()

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var teams []dto.Team
	for rows.Next() {
		var team dto.Team
		err = rows.Scan(&team.ID, &team.Name)
		if err != nil {
			return nil, err
		}
		teams = append(teams, team)
	}

	if len(teams) == 0 {
		return &[]dto.Team{}, nil
	}

	return &teams, nil
}
