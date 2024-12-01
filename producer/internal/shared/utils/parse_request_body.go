package utils

import (
	"encoding/json"
	"io"

	"github.com/go-playground/validator"
)

func ParseBody[T any](r io.Reader) (*T, error) {
	var entity T

	err := json.NewDecoder(r).Decode(&entity)
	if err != nil {
		return nil, err
	}
	err = validator.New().Struct(entity)
	if err != nil {
		return nil, err
	}

	return &entity, nil
}
