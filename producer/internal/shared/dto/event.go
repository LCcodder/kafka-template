package dto

type Score struct {
	GameID int

	PlayerID int  `json:"player_id" validate:"required"`
	Points   uint `json:"points" validate:"required,min=1,max=3"`

	Quarter uint   `json:"quarter" validate:"required,min=1,max=6"`
	Time    string `json:"time" validate:"required"`
}

type ScoreToPublish struct {
	ID string `json:"id"`

	Game         Game   `json:"game"`
	PlayerScored Player `json:"player_scored"`
	TeamScored   Team   `json:"team_scored"`
	Points       uint   `json:"points"`

	Quarter uint   `json:"quarter"`
	Time    string `json:"time"`
}

type Foul struct {
	GameID int

	Type       string `json:"type" validate:"required,min=1,max=16"`
	OnPlayerID int    `json:"on_player_id" validate:"required"`
	ByPlayerID int    `json:"from_player_id" validate:"required"`

	Quarter uint   `json:"quarter" validate:"required,min=1,max=6"`
	Time    string `json:"time" validate:"required"`
}

type FoulToPublish struct {
	ID string `json:"id"`

	Game Game   `json:"game"`
	Type string `json:"type"`

	OnPlayer Player `json:"on_player"`
	ByPlayer Player `json:"by_player"`
	ByTeam   Team   `json:"by_team"`

	Quarter uint   `json:"quarter"`
	Time    string `json:"time"`
}

type Substitution struct {
	GameID int

	WhomPlayerID int `json:"whom_player_id" validate:"required"`
	ToPlayerID   int `json:"to_player_id" validate:"required"`

	Quarter uint   `json:"quarter" validate:"required,min=1,max=6"`
	Time    string `json:"time" validate:"required"`
}

type SubstitutionToPublish struct {
	ID string `json:"id"`

	Game Game `json:"game"`

	WhomPlayer Player `json:"whom_player"`
	ToPlayer   Player `json:"to_player"`

	InTeam Team `json:"in_team"`

	Quarter uint   `json:"quarter"`
	Time    string `json:"time"`
}
