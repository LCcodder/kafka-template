package events_usecases

import (
	"encoding/json"

	"example.com/m/v2/internal/shared/dto"
	"example.com/m/v2/internal/shared/exceptions"
	games_usecases "example.com/m/v2/internal/usecases/games"
	players_usecases "example.com/m/v2/internal/usecases/players"
	teams_usecases "example.com/m/v2/internal/usecases/teams"
	"github.com/IBM/sarama"
	"github.com/google/uuid"
)

type EventUseCases struct {
	p   sarama.SyncProducer
	puc players_usecases.PlayersUseCases
	tuc teams_usecases.TeamsUseCases
	guc games_usecases.GamesUseCases
}

func NewEventUseCases(p *sarama.SyncProducer,
	puc *players_usecases.PlayersUseCases,
	tuc *teams_usecases.TeamsUseCases,
	guc *games_usecases.GamesUseCases) *EventUseCases {
	return &EventUseCases{
		p:   *p,
		puc: *puc,
		tuc: *tuc,
		guc: *guc,
	}
}

func createProducerMessage[T any](topic string, eventID string, value *T) (*sarama.ProducerMessage, error) {
	valueBytes, err := json.Marshal(*value)
	if err != nil {
		return nil, err
	}

	msg := &sarama.ProducerMessage{
		Topic: topic,
		Key:   sarama.StringEncoder(eventID),
		Value: sarama.ByteEncoder(valueBytes),
	}
	return msg, nil
}

func teamIsInGame(teamID int64, game dto.Game) bool {
	return game.TeamOneID == teamID || game.TeamTwoID == teamID
}

func validateScoring(game dto.Game, player dto.Player) *exceptions.Exception {
	if game.IsEnded {
		return &exceptions.ExcGameIsEnded
	}

	if !teamIsInGame(player.TeamID, game) {
		return &exceptions.ExcTeamNotFound
	}
	return nil
}

func (uc *EventUseCases) PublishScore(s *dto.Score) (*dto.ScoreToPublish, *exceptions.Exception) {
	game, exc := uc.guc.GetGameById(int64(s.GameID))
	if exc != nil {
		return nil, exc
	}
	playerScored, exc := uc.puc.GetPlayerById(int64(s.PlayerID))
	if exc != nil {
		return nil, exc
	}
	teamScored, exc := uc.tuc.GetTeamById(playerScored.TeamID)
	if exc != nil {
		return nil, exc
	}

	if exc = validateScoring(*game, *playerScored); exc != nil {
		return nil, exc
	}

	scoreToPublish := dto.ScoreToPublish{
		ID:           uuid.New().String(),
		Game:         *game,
		TeamScored:   *teamScored,
		PlayerScored: *playerScored,
		Quarter:      s.Quarter,
		Points:       s.Points,
		Time:         s.Time,
	}

	if _, exc = uc.guc.UpdateScore(game.ID, teamScored.ID, s.Points); exc != nil {
		return nil, exc
	}

	msg, err := createProducerMessage("Score", scoreToPublish.ID, &scoreToPublish)
	if err != nil {
		return nil, &exceptions.ExcFailedToParseMessage
	}

	_, _, err = uc.p.SendMessage(msg)
	if err != nil {
		return nil, &exceptions.ExcFailedToSendMessage
	}

	return &scoreToPublish, nil
}
