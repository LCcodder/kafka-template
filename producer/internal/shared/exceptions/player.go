package exceptions

var (
	ExcPlayerNotFound Exception = Exception{
		StatusCode: 404,
		Message:    "Player not found",
	}
)
