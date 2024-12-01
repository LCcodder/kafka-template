package dto

type Team struct {
	ID   int64  `db:"id" json:"id" validate:"omitempty"`
	Name string `json:"name" db:"name" validate:"required,min=1,max=16"`
}
