package middlewares

import "strings"

var Whitelist = []string{"swagger"}

func isWhitelisted(path string) bool {
	for _, w := range Whitelist {
		if strings.Contains(path, w) {
			return true
		}
	}
	return false
}
