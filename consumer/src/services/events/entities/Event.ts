import { KafkaMessage } from "kafkajs"
import { EventDtoSharedFields, IEvent } from "./IEvent"

export abstract class Event<T extends EventDtoSharedFields = EventDtoSharedFields> implements IEvent {
  constructor(
    private message: KafkaMessage
  ) {}

  protected get body(): T {
    let body = this.message.value?.toString('utf-8')
    body = JSON.parse(body as string)
    return body as unknown as T
  }

  public get eventId() {
    return this.message.key?.toString('utf-8') as string
  }

  public get teamOneId() {
    return this.body.game.team_one_id
  }

  public get teamTwoId() {
    return this.body.game.team_two_id
  }

  public get gameId() {
    return this.body.game.id
  }

  public abstract buildTelegramMessage(): string
}

