package middlewares

import (
	"net/http"

	"example.com/m/v2/internal/shared/config"
	"example.com/m/v2/internal/shared/exceptions"
	"example.com/m/v2/internal/shared/utils"
)

func Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		if isWhitelisted(r.URL.Path) {
			next.ServeHTTP(w, r)
			return
		}

		w.Header().Set("content-Type", "application/json")
		h := r.Header["Api-Key"]

		if h == nil {
			w.WriteHeader(401)
			w.Write(*utils.ParseResponse(exceptions.ExcWrongAPIKey))
			return
		}

		if h[0] != config.Config.APIMasterKey {
			w.WriteHeader(403)
			w.Write(*utils.ParseResponse(exceptions.ExcAccessDenied))
			return
		}

		next.ServeHTTP(w, r)
	})
}
