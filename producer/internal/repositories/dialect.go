package repositories

import "github.com/doug-martin/goqu/v9"

var dialect goqu.DialectWrapper = goqu.Dialect("mysql")
