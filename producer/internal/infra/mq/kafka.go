package mq

import (
	"github.com/IBM/sarama"
)

var Producer sarama.SyncProducer

func InitProducer() {
	producer, err := sarama.NewSyncProducer([]string{"localhost:29092"}, nil)
	if err != nil {
		panic(err)
	}

	Producer = producer
}
