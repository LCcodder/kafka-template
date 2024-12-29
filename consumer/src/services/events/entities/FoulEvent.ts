import { FoulDto } from "../../../common/dto/Events"
import { Event } from "./Event"
import { KafkaMessage } from "kafkajs"

export class FoulEvent extends Event<FoulDto> {
  constructor(message: KafkaMessage) { super(message) }

  public override buildTelegramMessage(): string {
    return ""
  }
}
