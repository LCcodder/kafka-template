package config

import (
	"fmt"
	"os"
	"strconv"
)

type AppConfig struct {
	MySQLConnectionString string
	AppPort               int
	APIMasterKey          string
	KafkaConnections      []string
}

var Config AppConfig

func InitConfig() {
	Config = AppConfig{
		MySQLConnectionString: fmt.Sprintf("%s:%s@tcp(%s)/%s",
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_HOST"),
			os.Getenv("DB_NAME")),
		APIMasterKey:     os.Getenv("API_MASTER_KEY"),
		KafkaConnections: []string{os.Getenv("KAFKA_CONNECTION")},
	}
	Config.AppPort, _ = strconv.Atoi(os.Getenv("APP_PORT"))
}
