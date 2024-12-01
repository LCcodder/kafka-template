package controllers

import (
	"net/http"

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

func (c *EventsController) publishScoreHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-Type", "application/json")

	score, err := utils.ParseBody[dto.Score](r.Body)
	if err != nil {
		w.WriteHeader(400)
		w.Write(*utils.ParseResponse(map[string]string{
			"error": err.Error(),
		}))
		return
	}

	exc := c.euc.PublishScore(score)
	if exc != nil {
		w.WriteHeader(int(exc.StatusCode))
		w.Write(*utils.ParseResponse(exc))
		return
	}

	w.WriteHeader(201)
	w.Write(*utils.ParseResponse(map[string]bool{
		"success": true,
	}))
}

func (c *EventsController) GetEventByIDHandler(w http.ResponseWriter, r *http.Request) {

}

func (c *EventsController) GetEventsByTopicHandler(w http.ResponseWriter, r *http.Request) {

}

func (c *EventsController) Setup() {
	c.r.Post("/score", c.publishScoreHandler)
}
