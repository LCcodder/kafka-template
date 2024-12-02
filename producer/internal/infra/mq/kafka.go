package mq

import (
	"example.com/m/v2/internal/shared/config"
	"github.com/IBM/sarama"
)

var Producer sarama.SyncProducer

func InitProducer() {
	producer, err := sarama.NewSyncProducer(config.Config.KafkaConnections, nil)
	if err != nil {
		panic(err)
	}

	Producer = producer
}
