import { FoulEventMessage } from "../../../bot/static/messages/EventMessages"
import { FoulDto } from "../../../shared/dto/Events"
import { Event } from "./Event"
import { KafkaMessage } from "kafkajs"

export class FoulEvent extends Event<FoulDto> {
  constructor(message: KafkaMessage) { super(message) }

  public override buildTelegramMessage() {
    return FoulEventMessage(this.body)
  }
}
