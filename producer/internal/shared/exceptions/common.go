package exceptions

var (
	ExcDatabaseError Exception = Exception{
		StatusCode: 503,
		Message:    "Database error, service unavailable",
	}
)
