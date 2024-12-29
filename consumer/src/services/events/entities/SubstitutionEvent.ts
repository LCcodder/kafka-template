import { SubstitutionDto } from "../../../common/dto/Events"
import { Event } from "./Event"
import { KafkaMessage } from "kafkajs"

export class SubstitutionEvent extends Event<SubstitutionDto> {
  constructor(message: KafkaMessage) { super(message) }

  public override buildTelegramMessage(): string {
    return ""
  }
}