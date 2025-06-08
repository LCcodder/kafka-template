package controllers

import (
	"net/http"
	"strconv"

	"example.com/m/v2/internal/shared/dto"
	"example.com/m/v2/internal/shared/utils"
	players_usecases "example.com/m/v2/internal/usecases/players"
	"github.com/go-chi/chi/v5"
)

type PlayersController struct {
	puc *players_usecases.PlayersUseCases
	r   *chi.Mux
}

func NewPlayersController(r *chi.Mux, puc *players_usecases.PlayersUseCases) *PlayersController {
	return &PlayersController{
		puc: puc,
		r:   r,
	}
}

func (c *PlayersController) createPlayerHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-Type", "application/json")

	player, err := utils.ParseBody[dto.Player](r.Body)
	if err != nil {
		w.WriteHeader(400)
		w.Write(*utils.ParseResponse(map[string]string{
			"error": err.Error(),
		}))
		return
	}

	createdPlayer, exc := c.puc.CreatePlayer(player)
	if exc != nil {
		w.WriteHeader(int(exc.StatusCode))
		w.Write(*utils.ParseResponse(exc))
		return
	}

	w.WriteHeader(201)
	w.Write(*utils.ParseResponse(createdPlayer))
}

func (c *PlayersController) getPlayerById(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-Type", "application/json")
	id, _ := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)

	player, exc := c.puc.GetPlayerById(id)
	if exc != nil {
		w.WriteHeader(int(exc.StatusCode))
		w.Write(*utils.ParseResponse(exc))
		return
	}

	w.WriteHeader(201)
	w.Write(*utils.ParseResponse(player))
}

func (c *PlayersController) getTeamPlayersHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-Type", "application/json")
	id, _ := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	players, exc := c.puc.GetPlayersByTeamId(id)
	if exc != nil {
		w.WriteHeader(int(exc.StatusCode))
		w.Write(*utils.ParseResponse(exc))
		return
	}

	w.WriteHeader(200)
	w.Write(*utils.ParseResponse(players))
}

func (c *PlayersController) Setup() {
	c.r.Post(prefix+"/players", c.createPlayerHandler)
	c.r.Get(prefix+"/players/{id}", c.getPlayerById)
	c.r.Get(prefix+"/teams/{id}/players", c.getTeamPlayersHandler)
}
