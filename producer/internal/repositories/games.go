package repositories

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"

	"example.com/m/v2/internal/shared/dto"
	"github.com/doug-martin/goqu/v9"
)

type GamesRepository struct {
	db *sql.DB
}

func NewGamesRepository(db *sql.DB) *GamesRepository {
	return &GamesRepository{
		db: db,
	}
}

func (r *GamesRepository) Insert(p *dto.Game) (*int64, error) {
	query, _, _ := dialect.Insert("games").Rows(*p).ToSQL()
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

func (r *GamesRepository) Get(id int64) (*dto.Game, error) {
	query, _, _ := dialect.From("games").Where(goqu.Ex{
		"id": id,
	}).ToSQL()

	var game dto.Game

	err := r.db.QueryRow(query).Scan(
		&game.ID,
		&game.TeamOneScore,
		&game.TeamTwoScore,
		&game.TeamOneID,
		&game.TeamTwoID,
		&game.IsEnded,
		&game.CreatedAt,
		&game.UpdatedAt,
	)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &game, nil
}

func (r *GamesRepository) Update(id int64, g dto.UpdateGame) error {
	var uMap map[string]interface{}
	inrec, _ := json.Marshal(g)
	json.Unmarshal(inrec, &uMap)

	var rec goqu.Record = uMap
	query, _, _ := goqu.From("games").Where(goqu.C("id").Eq(id)).Update().Set(
		rec,
	).ToSQL()

	_, err := r.db.Exec(query)
	if err != nil {
		fmt.Println(err)
		return err
	}

	return nil
}
