import { ScoreEventMessage } from "../../../bot/static/messages/EventMessages"
import { ScoreDto } from "../../../shared/dto/Events"
import { Event } from "./Event"
import { KafkaMessage } from "kafkajs"

export class ScoreEvent extends Event<ScoreDto> {
  constructor(message: KafkaMessage) { super(message) }

  public override buildTelegramMessage() {
    return ScoreEventMessage(this.body)
  }
}