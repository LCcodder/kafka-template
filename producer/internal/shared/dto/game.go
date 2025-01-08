package dto

type Game struct {
	ID            int64  `json:"id,omitempty" db:"id"`
	TeamHomeScore uint   `json:"team_home_score" db:"team_home_score"`
	TeamAwayScore uint   `json:"team_away_score" db:"team_away_score"`
	TeamHomeID    int64  `json:"team_home_id" db:"team_home_id" validate:"required"`
	TeamAwayID    int64  `json:"team_away_id" db:"team_away_id" validate:"required"`
	IsEnded       bool   `json:"is_ended" db:"is_ended"`
	CreatedAt     string `json:"created_at" db:"created_at"`
	UpdatedAt     string `json:"updated_at" db:"updated_at"`
}

type UpdateGame struct {
	TeamHomeScore uint   `json:"team_home_score,omitempty" db:"team_home_score" validate:""`
	TeamAwayScore uint   `json:"team_away_score,omitempty" db:"team_away_score" validate:""`
	IsEnded       bool   `json:"is_ended,omitempty" db:"is_ended" validate:""`
	UpdatedAt     string `json:"updated_at,omitempty" db:"updated_at"`
}
