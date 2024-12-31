import { SubstitutionEventMesssage } from "../../../bot/static/messages/EventMessages"
import { SubstitutionDto } from "../../../shared/dto/Events"
import { Event } from "./Event"
import { KafkaMessage } from "kafkajs"

export class SubstitutionEvent extends Event<SubstitutionDto> {
  constructor(message: KafkaMessage) { super(message) }

  public override buildTelegramMessage(): string {
    return SubstitutionEventMesssage(this.body)
  }
}