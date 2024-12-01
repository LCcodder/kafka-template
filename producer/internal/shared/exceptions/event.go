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
)
