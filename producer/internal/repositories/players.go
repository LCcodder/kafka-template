package repositories

import (
	"database/sql"
	"errors"
	"fmt"

	"example.com/m/v2/internal/shared/dto"
	"github.com/doug-martin/goqu/v9"
	_ "github.com/doug-martin/goqu/v9/dialect/mysql"
)

type PlayersRepository struct {
	db *sql.DB
}

func NewPlayersRepository(db *sql.DB) *PlayersRepository {
	return &PlayersRepository{
		db: db,
	}
}

func (r *PlayersRepository) Insert(p *dto.Player) (*int64, error) {
	query, _, _ := dialect.Insert("players").Rows(*p).ToSQL()
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

func (r *PlayersRepository) Get(id int64) (*dto.Player, error) {
	query, _, _ := dialect.From("players").Where(goqu.Ex{
		"id": id,
	}).ToSQL()

	var player dto.Player

	err := r.db.QueryRow(query).Scan(
		&player.ID,
		&player.FirstName,
		&player.LastName,
		&player.Number,
		&player.Position,
		&player.TeamID,
	)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &player, nil
}
