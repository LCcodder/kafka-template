package exceptions

var (
	ExcGameIsEnded Exception = Exception{
		StatusCode: 400,
		Message:    "Game is ended, can't do this action",
	}

	ExcTeamNotInGame Exception = Exception{
		StatusCode: 400,
		Message:    "That team not in this game",
	}

	ExcCantReplacePlayerFromAnotherTeam Exception = Exception{
		StatusCode: 400,
		Message:    "Can not replace to player from another team",
	}

	ExcCantFoulOnPlayerFromSameTeam Exception = Exception{
		StatusCode: 400,
		Message:    "Can not foul on teamate",
	}
)
