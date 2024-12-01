package dto

type Score struct {
	ID string `json:"id" validate:"omitempty"`

	// autoset
	TeamID int64 `json:"team_id" validate:"omitempty"`

	PlayerID int  `json:"player_id" validate:"required"`
	Points   uint `json:"points" validate:"required,min=1,max=3"`

	Quarter uint   `json:"quarter" validate:"required,min=1,max=6"`
	Time    string `json:"time" validate:"required"`
}

type Foul struct {
	ID string `json:"id"`

	Type       string `json:"type" validate:"required,min=1,max=16"`
	OnPlayerID int    `json:"on_player_id" validate:"required"`
	ByPlayerID int    `json:"from_player_id" validate:"required"`

	// autoset
	ByTeamID int `json:"by_team_id"`

	Quarter uint   `json:"quarter" validate:"required,min=1,max=6"`
	Time    string `json:"time" validate:"required"`
}

type Substitution struct {
	ID string `json:"id"`

	WhomPlayerID int `json:"whom_player_id" validate:"required"`
	ToPlayerID   int `json:"to_player_id" validate:"required"`

	// autoset
	TeamID int64 `json:"in_team"`

	Quarter uint   `json:"quarter" validate:"required,min=1,max=6"`
	Time    string `json:"time" validate:"required"`
}
