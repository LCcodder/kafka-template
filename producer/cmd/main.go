package main

import (
	"database/sql"
	"log"
	"net/http"

	_ "example.com/m/v2/docs" // Import the docs package to generate Swagger docs
	"example.com/m/v2/internal/adapters/controllers"
	"example.com/m/v2/internal/adapters/repositories"
	"example.com/m/v2/internal/infra/db"
	"example.com/m/v2/internal/infra/mq"
	"example.com/m/v2/internal/shared/config"
	"example.com/m/v2/internal/shared/middlewares"
	events_usecases "example.com/m/v2/internal/usecases/events"
	games_usecases "example.com/m/v2/internal/usecases/games"
	players_usecases "example.com/m/v2/internal/usecases/players"
	teams_usecases "example.com/m/v2/internal/usecases/teams"
	"github.com/IBM/sarama"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
)

func loadEnv() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}
}

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Api-Key

func main() {
	loadEnv()
	config.InitConfig()

	mq.InitProducer()
	defer mq.Producer.Close()
	db.ConnectToMySQL()
	defer db.Db.Close()

	r := chi.NewRouter()
	r.Use(middleware.Logger)

	diContainer(db.Db, r, &mq.Producer)

	http.ListenAndServe(":3000", r)
}

func diContainer(db *sql.DB, r *chi.Mux, p *sarama.SyncProducer) {
	playersRepository := repositories.NewPlayersRepository(db)
	teamsRepository := repositories.NewTeamsRepository(db)
	gamesRepository := repositories.NewGamesRepository(db)

	teamsUseCases := teams_usecases.NewTeamsUseCases(teamsRepository)
	gamesUseCases := games_usecases.NewGamesUseCases(gamesRepository, teamsUseCases)
	playersUseCases := players_usecases.NewPlayersUseCases(playersRepository, teamsUseCases)
	eventsUseCases := events_usecases.NewEventUseCases(p, playersUseCases, teamsUseCases, gamesUseCases)

	r.Use(middlewares.Authenticate)
	controllers.NewSwagController(r).Setup()
	controllers.NewPlayersController(r, playersUseCases).Setup()
	controllers.NewTeamsController(r, teamsUseCases).Setup()
	controllers.NewEventsController(r, eventsUseCases).Setup()
	controllers.NewGamesController(r, gamesUseCases).Setup()
}
