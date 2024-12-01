package utils

import (
	"encoding/json"
)

func ParseResponse[T any](result T) *[]byte {
	jsonResponse, err := json.Marshal(result)
	if err != nil {
		return new([]byte)
	}

	return &jsonResponse
}
