import { Consumer, EachMessagePayload } from "kafkajs"
import { Telegram } from "telegraf";
import { Event } from "../entities/Event";
import { IUsersService } from "../../users/IUsersService";
import { isException } from "../../../shared/utils/guards/ExceptionGuard";
import { eventFactory } from "../entities/EventFactory";

export class EventsService {
  constructor(
    private telegram: Telegram, 
    private consumer: Consumer, 
    private usersService: IUsersService
  ) {}

  private async subscribeToTopics(): Promise<void> {
    await this.consumer.subscribe({ 
      topics: ['Fouls', 'Score', 'Substitutions'] 
    })
  }


  private async eachMessage({ message, topic }: EachMessagePayload): Promise<void> {
    const event = eventFactory(topic, message) as Event

    const subscribers = await this.usersService.getSubscribers({
      teamHomeId: event.teamHomeId,
      teamAwayId: event.teamAwayId,
      gameId: event.gameId
    })
    if (isException(subscribers)) return
    

    for (const subscriber of subscribers) {

      try {
        await this.telegram.sendMessage(subscriber.id, event.buildTelegramMessage())        
      } catch {}

    }
  }

  public async listenEvents() {
    await this.consumer.connect()
    await this.subscribeToTopics()

    await this.consumer.run({
      eachMessage: this.eachMessage.bind(this)
    })
  }
}