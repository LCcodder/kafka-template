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

// @BasePath /api/v1

// Create a new game
// @Description Create a new game, returns created game data
// @Tags Games
// @Accept json
// @Produce json
// @Param game body dto.Game true "Game data"
// @Success 201 {object} dto.Game
// @Failure 400 {object} map[string]string
// @Failure 500 {object} exceptions.Exception
// @Security ApiKeyAuth
// @Router /api/v1/games [post]
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

// Get game by ID
// @Description Get game by ID, returns game data
// @Tags Games
// @Accept json
// @Produce json
// @Param id path int true "Game ID"
// @Success 201 {object} dto.Game
// @Failure 404 {object} exceptions.Exception
// @Failure 500 {object} exceptions.Exception
// @Security ApiKeyAuth
// @Router /api/v1/games/{id} [get]
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

// Get game by ID
// @Description Get game by ID, returns game data
// @Tags Games
// @Accept json
// @Produce json
// @Param id path int true "Game ID"
// @Success 201 {object} dto.Game
// @Failure 404 {object} exceptions.Exception
// @Failure 500 {object} exceptions.Exception
// @Security ApiKeyAuth
// @Router /api/v1/games/{id}/close [patch]
func (c *GamesController) closeGameHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-Type", "application/json")

	id, _ := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)

	exc := c.guc.CloseGame(id)
	if exc != nil {
		w.WriteHeader(int(exc.StatusCode))
		w.Write(*utils.ParseResponse(exc))
		return
	}

	w.WriteHeader(200)
	w.Write(*utils.ParseResponse(map[string]bool{
		"success": true,
	}))
}

// Get all games
// @Description Get all games, returns list of games
// @Tags Games
// @Accept json
// @Produce json
// @Param is_ended query bool false "Filter by ended games (true/false)"
// @Success 200 {array} dto.Game
// @Failure 500 {object} exceptions.Exception
// @Security ApiKeyAuth
// @Router /api/v1/games [get]
func (c *GamesController) getGamesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-Type", "application/json")

	isEndedStr := r.URL.Query().Get("is_ended")
	isEnded := isEndedStr == "true" || isEndedStr == "1"

	games, exc := c.guc.GetGames(isEnded)
	if exc != nil {
		w.WriteHeader(int(exc.StatusCode))
		w.Write(*utils.ParseResponse(exc))
		return
	}
	w.WriteHeader(200)
	w.Write(*utils.ParseResponse(games))

}

func (c *GamesController) Setup() {
	c.r.Post(prefix+"/games", c.createGameHandler)
	c.r.Get(prefix+"/games", c.getGamesHandler)
	c.r.Get(prefix+"/games/{id}", c.getGameById)
	c.r.Patch(prefix+"/games/{id}/close", c.closeGameHandler)
}
