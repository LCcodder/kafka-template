package exceptions

var (
	ExcDatabaseError Exception = Exception{
		StatusCode: 500,
		Message:    "Database internal error",
	}

	ExcServiceUnavailable Exception = Exception{
		StatusCode: 503,
		Message:    "Service unavailable",
	}
)
