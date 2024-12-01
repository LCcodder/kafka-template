package controllers

import (
	"net/http"
	"strconv"

	"example.com/m/v2/internal/shared/dto"
	"example.com/m/v2/internal/shared/utils"
	games_usecases "example.com/m/v2/internal/usecases/games"
	"github.com/go-chi/chi/v5"
)

type GamesController struct {
	guc *games_usecases.GamesUseCases
	r   *chi.Mux
}

func NewGamesController(r *chi.Mux, guc *games_usecases.GamesUseCases) *GamesController {
	return &GamesController{
		guc: guc,
		r:   r,
	}
}

func (c *GamesController) createGameHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-Type", "application/json")

	game, err := utils.ParseBody[dto.Game](r.Body)
	if err != nil {
		w.WriteHeader(400)
		w.Write(*utils.ParseResponse(map[string]string{
			"error": err.Error(),
		}))
		return
	}

	createdTeam, exc := c.guc.CreateGame(game)
	if exc != nil {
		w.WriteHeader(int(exc.StatusCode))
		w.Write(*utils.ParseResponse(exc))
		return
	}

	w.WriteHeader(201)
	w.Write(*utils.ParseResponse(createdTeam))
}

func (c *GamesController) getGameById(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-Type", "application/json")

	id, _ := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)

	game, exc := c.guc.GetGameById(id)
	if exc != nil {
		w.WriteHeader(int(exc.StatusCode))
		w.Write(*utils.ParseResponse(exc))
		return
	}

	w.WriteHeader(201)
	w.Write(*utils.ParseResponse(game))
}

func (c *GamesController) Setup() {
	c.r.Post(prefix+"/games", c.createGameHandler)
	c.r.Get(prefix+"/games/{id}", c.getGameById)
}
