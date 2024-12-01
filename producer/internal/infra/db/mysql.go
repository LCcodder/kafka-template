package db

import (
	"database/sql"
	"fmt"

	"example.com/m/v2/internal/shared/config"
	_ "github.com/go-sql-driver/mysql"
)

var Db *sql.DB

func ConnectToMySQL() {
	db, err := sql.Open("mysql", config.Config.MySQLConnectionString)
	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	Db = db
	fmt.Println("Connected to database: " + config.Config.MySQLConnectionString)
}
