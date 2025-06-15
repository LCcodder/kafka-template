package controllers

import (
	"net/http"
	"strconv"

	"example.com/m/v2/internal/shared/dto"
	"example.com/m/v2/internal/shared/utils"
	events_usecases "example.com/m/v2/internal/usecases/events"
	"github.com/go-chi/chi/v5"
)

type EventsController struct {
	euc *events_usecases.EventUseCases
	r   *chi.Mux
}

func NewEventsController(r *chi.Mux, euc *events_usecases.EventUseCases) *EventsController {
	return &EventsController{
		euc: euc,
		r:   r,
	}
}

// @BasePath /api/v1

// Publish score event
// @Description Publish a score event for a game, returns event data
// @Tags Events
// @Accept json
// @Produce json
// @Param id path int true "Game ID"
// @Param score body dto.Score true "Score event data"
// @Success 201 {object} dto.ScoreToPublish
// @Failure 400 {object} map[string]string
// @Failure 404 {object} exceptions.Exception
// @Failure 500 {object} exceptions.Exception
// @Security ApiKeyAuth
// @Router /api/v1/games/{id}/score [post]
func (c *EventsController) publishScoreHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-Type", "application/json")

	gameID, _ := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)

	score, err := utils.ParseBody[dto.Score](r.Body)
	if err != nil {
		w.WriteHeader(400)
		w.Write(*utils.ParseResponse(map[string]string{
			"error": err.Error(),
		}))
		return
	}

	score.GameID = int(gameID)

	publishedScore, exc := c.euc.PublishScore(score)
	if exc != nil {
		w.WriteHeader(int(exc.StatusCode))
		w.Write(*utils.ParseResponse(exc))
		return
	}

	w.WriteHeader(201)
	w.Write(*utils.ParseResponse(publishedScore))
}

// Publish foul event
// @Description Publish a foul event for a game, returns event data
// @Tags Events
// @Accept json
// @Produce json
// @Param id path int true "Game ID"
// @Param foul body dto.Foul true "Foul event data"
// @Success 201 {object} dto.FoulToPublish
// @Failure 400 {object} map[string]string
// @Failure 404 {object} exceptions.Exception
// @Failure 500 {object} exceptions.Exception
// @Security ApiKeyAuth
// @Router /api/v1/games/{id}/fouls [post]
func (c *EventsController) publishFoulHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-Type", "application/json")

	gameID, _ := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)

	foul, err := utils.ParseBody[dto.Foul](r.Body)
	if err != nil {
		w.WriteHeader(400)
		w.Write(*utils.ParseResponse(map[string]string{
			"error": err.Error(),
		}))
		return
	}

	foul.GameID = int(gameID)

	publishedFoul, exc := c.euc.PublishFoul(foul)
	if exc != nil {
		w.WriteHeader(int(exc.StatusCode))
		w.Write(*utils.ParseResponse(exc))
		return
	}

	w.WriteHeader(201)
	w.Write(*utils.ParseResponse(publishedFoul))
}

// Publish substitution event
// @Description Publish a substitution event for a game, returns event data
// @Tags Events
// @Accept json
// @Produce json
// @Param id path int true "Game ID"
// @Param substitution body dto.Substitution true "Substitution event data"
// @Success 201 {object} dto.SubstitutionToPublish
// @Failure 400 {object} map[string]string
// @Failure 404 {object} exceptions.Exception
// @Failure 500 {object} exceptions.Exception
// @Security ApiKeyAuth
// @Router /api/v1/games/{id}/substitutions [post]
func (c *EventsController) publishSubstitutionHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-Type", "application/json")

	gameID, _ := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)

	substitution, err := utils.ParseBody[dto.Substitution](r.Body)
	if err != nil {
		w.WriteHeader(400)
		w.Write(*utils.ParseResponse(map[string]string{
			"error": err.Error(),
		}))
		return
	}

	substitution.GameID = int(gameID)

	publishedSubstitution, exc := c.euc.PublishSubstitution(substitution)
	if exc != nil {
		w.WriteHeader(int(exc.StatusCode))
		w.Write(*utils.ParseResponse(exc))
		return
	}

	w.WriteHeader(201)
	w.Write(*utils.ParseResponse(publishedSubstitution))
}

func (c *EventsController) Setup() {
	c.r.Post(prefix+"/games/{id}/score", c.publishScoreHandler)
	c.r.Post(prefix+"/games/{id}/fouls", c.publishFoulHandler)
	c.r.Post(prefix+"/games/{id}/substitutions", c.publishSubstitutionHandler)
}
