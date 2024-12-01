package config

import "fmt"

type AppConfig struct {
	MySQLConnectionString string
	AppPort               int
}

var Config AppConfig

func InitConfig() {
	Config = AppConfig{
		AppPort:               8080,
		MySQLConnectionString: fmt.Sprintf("%s:%s@tcp(%s)/%s", "root", "robocopid12", "localhost", "basketball_aggregator"),
	}
}
