import { ScoreDto } from "../../../common/dto/Events"
import { Event } from "./Event"
import { KafkaMessage } from "kafkajs"

export class ScoreEvent extends Event<ScoreDto> {
  constructor(message: KafkaMessage) { super(message) }

  public override buildTelegramMessage(): string {
    return ""
  }
}