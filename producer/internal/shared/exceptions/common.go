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

	ExcWrongAPIKey Exception = Exception{
		StatusCode: 401,
		Message:    "API key is invalid or missing",
	}

	ExcAccessDenied Exception = Exception{
		StatusCode: 403,
		Message:    "API key is not master key",
	}
)
