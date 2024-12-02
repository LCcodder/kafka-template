package exceptions

var (
	ExcGameNotFound Exception = Exception{
		StatusCode: 404,
		Message:    "Game not found",
	}

	ExcGameAlreadyClosed Exception = Exception{
		StatusCode: 400,
		Message:    "Game already is closed",
	}
)
