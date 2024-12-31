import { Kafka, Consumer, EachMessagePayload, KafkaMessage } from "kafkajs"
import { Telegram } from "telegraf";
import { eventFactory } from "../entities/Event";
import { Event } from "../entities/Event";
import { IUsersService } from "../../users/IUsersService";
import { isException } from "../../../shared/utils/guards/ExceptionGuard";

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


  private async eachMessage({ message, topic }: EachMessagePayload) {
    const event = eventFactory(topic, message) as Event

    const firstTeamSubs = await this.usersService.getTeamSubscribers(event.teamOneId)
    const secondTeamSubs = await this.usersService.getTeamSubscribers(event.teamTwoId)
    const gameSubs = await this.usersService.getGameSubscribers(event.gameId)
    // todo
    if (isException(firstTeamSubs) || isException(secondTeamSubs) || isException(gameSubs)) {
      console.log("[FATAL] Database internal error while getting subscribers")
      return
    }
    

    let allSubscibers = [...firstTeamSubs, ...secondTeamSubs, ...gameSubs]

    // changing array data structure from '{ id: string }' to 'string'
    allSubscibers.map((v, i, a) => {
      // @ts-ignore
      a[i] = v.id
    })
    
    // removing all duplicates from subs (e.g. users that subscribed for both teams for example)
    const allSubscibersIds = [...new Set(allSubscibers)] as unknown as string[]

    for (const chatId of allSubscibersIds) {
      try {
        await this.telegram.sendMessage(chatId, event.buildTelegramMessage())
      } catch (e) {
        console.log(e)
      }
    }

  }

  public async listenEvents() {
    await this.consumer.connect()
    await this.subscribeToTopics()

    await this.consumer.run({
      eachMessage: this.eachMessage
    })
  }
}