package dto

type Game struct {
	ID           int64  `json:"id,omitempty" db:"id"`
	TeamOneScore uint   `json:"team_one_score" db:"team_one_score"`
	TeamTwoScore uint   `json:"team_two_score" db:"team_two_score"`
	TeamOneID    int64  `json:"team_one_id" db:"team_one_id" validate:"required"`
	TeamTwoID    int64  `json:"team_two_id" db:"team_two_id" validate:"required"`
	IsEnded      bool   `json:"is_ended" db:"is_ended"`
	CreatedAt    string `json:"created_at" db:"created_at"`
	UpdatedAt    string `json:"updated_at" db:"updated_at"`
}

type UpdateGame struct {
	TeamOneScore uint   `json:"team_one_score,omitempty" db:"team_one_score" validate:""`
	TeamTwoScore uint   `json:"team_two_score,omitempty" db:"team_two_score" validate:""`
	IsEnded      bool   `json:"is_ended,omitempty" db:"is_ended" validate:""`
	UpdatedAt    string `json:"updated_at,omitempty" db:"updated_at"`
}
