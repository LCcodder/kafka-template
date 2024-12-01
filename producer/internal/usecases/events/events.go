package events_usecases

import (
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

	if exc = validateAction(*game, *playerScored); exc != nil {
		return nil, exc
	}

	scoreToPublish := dto.ScoreToPublish{
		ID:           uuid.New().String(),
		Game:         *game,
		TeamScored:   *teamScored,
		PlayerScored: *playerScored,
		Points:       s.Points,
		Quarter:      s.Quarter,
		Time:         s.Time,
	}

	if _, exc = uc.guc.UpdateScore(game.ID, teamScored.ID, s.Points); exc != nil {
		return nil, exc
	}

	msg, err := createProducerMessage("Score", scoreToPublish.ID, &scoreToPublish)
	if err != nil {
		return nil, &exceptions.ExcServiceUnavailable
	}

	_, _, err = uc.p.SendMessage(msg)
	if err != nil {
		return nil, &exceptions.ExcServiceUnavailable
	}

	return &scoreToPublish, nil
}

func (uc *EventUseCases) PublishFoul(f *dto.Foul) (*dto.FoulToPublish, *exceptions.Exception) {
	game, exc := uc.guc.GetGameById(int64(f.GameID))
	if exc != nil {
		return nil, exc
	}

	playerFouled, exc := uc.puc.GetPlayerById(int64(f.ByPlayerID))
	if exc != nil {
		return nil, exc
	}

	playerWhichWasFouled, exc := uc.puc.GetPlayerById(int64(f.OnPlayerID))
	if exc != nil {
		return nil, exc
	}

	teamFouled, exc := uc.tuc.GetTeamById(playerFouled.TeamID)
	if exc != nil {
		return nil, exc
	}

	if playersAreFromSameTeam(*playerFouled, *playerWhichWasFouled) {
		return nil, &exceptions.ExcCantFoulOnPlayerFromSameTeam
	}

	// validating first player action, then next one
	if exc = validateAction(*game, *playerFouled); exc != nil {
		return nil, exc
	}
	if exc = validateAction(*game, *playerWhichWasFouled); exc != nil {
		return nil, exc
	}

	foulToPublish := dto.FoulToPublish{
		ID:       uuid.New().String(),
		Game:     *game,
		Type:     f.Time,
		OnPlayer: *playerWhichWasFouled,
		ByPlayer: *playerFouled,
		ByTeam:   *teamFouled,
		Quarter:  f.Quarter,
		Time:     f.Time,
	}

	msg, err := createProducerMessage("Fouls", foulToPublish.ID, &foulToPublish)
	if err != nil {
		return nil, &exceptions.ExcServiceUnavailable
	}

	_, _, err = uc.p.SendMessage(msg)
	if err != nil {
		return nil, &exceptions.ExcServiceUnavailable
	}

	return &foulToPublish, nil
}

func (uc *EventUseCases) PublishSubstitution(s *dto.Substitution) (*dto.SubstitutionToPublish, *exceptions.Exception) {
	game, exc := uc.guc.GetGameById(int64(s.GameID))
	if exc != nil {
		return nil, exc
	}

	outgoingPlayer, exc := uc.puc.GetPlayerById(int64(s.WhomPlayerID))
	if exc != nil {
		return nil, exc
	}

	incomingPlayer, exc := uc.puc.GetPlayerById(int64(s.ToPlayerID))
	if exc != nil {
		return nil, exc
	}

	if !playersAreFromSameTeam(*outgoingPlayer, *incomingPlayer) {
		return nil, &exceptions.ExcCantReplacePlayerFromAnotherTeam
	}

	team, exc := uc.tuc.GetTeamById(outgoingPlayer.TeamID)
	if exc != nil {
		return nil, exc
	}

	// validating first player action, then next one
	if exc = validateAction(*game, *outgoingPlayer); exc != nil {
		return nil, exc
	}
	if exc = validateAction(*game, *incomingPlayer); exc != nil {
		return nil, exc
	}

	substitutionToPublish := dto.SubstitutionToPublish{
		ID:   uuid.New().String(),
		Game: *game,

		WhomPlayer: *outgoingPlayer,
		ToPlayer:   *incomingPlayer,
		InTeam:     *team,

		Quarter: s.Quarter,
		Time:    s.Time,
	}

	msg, err := createProducerMessage("Fouls", substitutionToPublish.ID, &substitutionToPublish)
	if err != nil {
		return nil, &exceptions.ExcServiceUnavailable
	}

	_, _, err = uc.p.SendMessage(msg)
	if err != nil {
		return nil, &exceptions.ExcServiceUnavailable
	}

	return &substitutionToPublish, nil
}
