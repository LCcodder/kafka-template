package controllers

import (
	"github.com/go-chi/chi/v5"
	httpSwagger "github.com/swaggo/http-swagger"
)

type SwagController struct {
	r *chi.Mux
}

func NewSwagController(r *chi.Mux) *SwagController {
	return &SwagController{
		r: r,
	}
}

func (c *SwagController) Setup() {
	c.r.Get("/swagger/*", httpSwagger.WrapHandler)
}
