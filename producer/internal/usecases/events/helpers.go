package events_usecases

import (
	"encoding/json"

	"example.com/m/v2/internal/shared/dto"
	"example.com/m/v2/internal/shared/exceptions"
	"github.com/IBM/sarama"
)

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
	return game.TeamHomeID == teamID || game.TeamAwayID == teamID
}

func validateAction(game dto.Game, player dto.Player) *exceptions.Exception {
	if game.IsEnded {
		return &exceptions.ExcGameIsEnded
	}

	if !teamIsInGame(player.TeamID, game) {
		return &exceptions.ExcTeamNotFound
	}
	return nil
}

func playersAreFromSameTeam(playerOne dto.Player, playerTwo dto.Player) bool {
	return playerOne.TeamID == playerTwo.TeamID
}

func getOpposingTeamId(thisTeamId int64, game dto.Game) int64 {
	if thisTeamId == game.TeamHomeID {
		return game.TeamAwayID
	}
	return game.TeamHomeID
}
