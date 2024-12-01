package events_usecases

import (
	"encoding/json"

	"example.com/m/v2/internal/shared/dto"
	"example.com/m/v2/internal/shared/exceptions"
	players_usecases "example.com/m/v2/internal/usecases/players"
	teams_usecases "example.com/m/v2/internal/usecases/teams"
	"github.com/IBM/sarama"
	"github.com/google/uuid"
)

type EventUseCases struct {
	p   sarama.SyncProducer
	puc players_usecases.PlayersUseCases
	tuc teams_usecases.TeamsUseCases
}

func NewEventUseCases(p *sarama.SyncProducer,
	puc *players_usecases.PlayersUseCases,
	tuc *teams_usecases.TeamsUseCases) *EventUseCases {
	return &EventUseCases{
		p:   *p,
		puc: *puc,
		tuc: *tuc,
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

func (uc *EventUseCases) PublishScore(s *dto.Score) *exceptions.Exception {
	playerScored, exc := uc.puc.GetPlayerById(int64(s.PlayerID))
	if exc != nil {
		return exc
	}
	teamScored, exc := uc.tuc.GetTeamById(playerScored.TeamID)
	if exc != nil {
		return exc
	}

	s.TeamID = teamScored.ID
	s.ID = uuid.New().String()

	msg, err := createProducerMessage("Score", s.ID, s)
	if err != nil {
		return &exceptions.ExcFailedToParseMessage
	}

	_, _, err = uc.p.SendMessage(msg)
	if err != nil {
		return &exceptions.ExcFailedToSendMessage
	}
	return nil
}
