package controllers

import (
	"net/http"
	"strconv"

	"example.com/m/v2/internal/shared/dto"
	"example.com/m/v2/internal/shared/utils"
	teams_usecases "example.com/m/v2/internal/usecases/teams"
	"github.com/go-chi/chi/v5"
)

type TeamsController struct {
	tuc *teams_usecases.TeamsUseCases
	r   *chi.Mux
}

func NewTeamsController(r *chi.Mux, tuc *teams_usecases.TeamsUseCases) *TeamsController {
	return &TeamsController{
		tuc: tuc,
		r:   r,
	}
}

func (c *TeamsController) createTeamHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-Type", "application/json")

	team, err := utils.ParseBody[dto.Team](r.Body)
	if err != nil {
		w.WriteHeader(400)
		w.Write(*utils.ParseResponse(map[string]string{
			"error": err.Error(),
		}))
		return
	}

	createdTeam, exc := c.tuc.CreateTeam(team)
	if exc != nil {
		w.WriteHeader(int(exc.StatusCode))
		w.Write(*utils.ParseResponse(exc))
		return
	}

	w.WriteHeader(201)
	w.Write(*utils.ParseResponse(createdTeam))
}

func (c *TeamsController) getTeamById(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-Type", "application/json")
	id, _ := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)

	team, exc := c.tuc.GetTeamById(id)
	if exc != nil {
		w.WriteHeader(int(exc.StatusCode))
		w.Write(*utils.ParseResponse(exc))
		return
	}

	w.WriteHeader(201)
	w.Write(*utils.ParseResponse(team))
}

func (c *TeamsController) GetAllTeams(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-Type", "application/json")

	teams, exc := c.tuc.GetAllTeams()
	if exc != nil {
		w.WriteHeader(int(exc.StatusCode))
		w.Write(*utils.ParseResponse(exc))
		return
	}

	if teams == nil {
		teams = &[]dto.Team{}
	}

	w.WriteHeader(200)
	w.Write(*utils.ParseResponse(teams))
}

func (c *TeamsController) Setup() {
	c.r.Post(prefix+"/teams", c.createTeamHandler)
	c.r.Get(prefix+"/teams", c.GetAllTeams)
	c.r.Get(prefix+"/teams/{id}", c.getTeamById)
}
