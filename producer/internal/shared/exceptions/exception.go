package exceptions

type Exception struct {
	StatusCode uint   `json:"status_code"`
	Message    string `json:"message"`
}
