package exceptions

var (
	ExcFailedToParseMessage Exception = Exception{
		StatusCode: 503,
		Message:    "Failed to marshall message to JSON format",
	}

	ExcFailedToSendMessage Exception = Exception{
		StatusCode: 503,
		Message:    "Failed to publish event",
	}

	ExcGameIsEnded Exception = Exception{
		StatusCode: 400,
		Message:    "Game is ended, can't do this action",
	}

	ExcTeamNotInGame Exception = Exception{
		StatusCode: 400,
		Message:    "That team not in this game",
	}
)
