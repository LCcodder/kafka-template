package exceptions

var (
	ExcGameNotFound Exception = Exception{
		StatusCode: 404,
		Message:    "Game not found",
	}
)
