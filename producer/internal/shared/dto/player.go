package dto

type Player struct {
	ID        int64  `db:"id" json:"id" validate:"omitempty"`
	FirstName string `json:"first_name" db:"first_name" validate:"required,min=1,max=16"`
	LastName  string `json:"last_name" db:"last_name" validate:"required,min=1,max=28"`
	Number    int    `json:"number" db:"number" validate:"required"`
	Position  string `json:"position" db:"position" validate:"required,min=1,max=2"`
	TeamID    int64  `json:"team_id" db:"team_id" validate:"required"`
}
