package exceptions

var (
	ExcTeamNotFound Exception = Exception{
		StatusCode: 404,
		Message:    "Team not found",
	}
)
