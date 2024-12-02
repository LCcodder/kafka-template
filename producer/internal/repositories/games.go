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
	query, _, _ := dialect.From("games").Where(goqu.C("id").Eq(id)).Update().Set(
		rec,
	).ToSQL()

	_, err := r.db.Exec(query)
	if err != nil {
		fmt.Println(err)
		return err
	}

	return nil
}

func (r *GamesRepository) CloseGame(id int64) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}

	closeGameQuery, _, _ := dialect.From("games").Where(goqu.C("id").Eq(id)).Update().Set(
		map[string]bool{
			"is_ended": true,
		},
	).ToSQL()

	_, err = tx.Exec(closeGameQuery)
	if err != nil {
		return err
	}

	deleteGameSubscriptionsQuery, _, _ := dialect.Delete("users_subscriptions_games").Where(goqu.Ex{
		"game_id": id,
	}).ToSQL()

	_, err = tx.Exec(deleteGameSubscriptionsQuery)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}
