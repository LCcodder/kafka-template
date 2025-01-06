import { FoulEvent } from "./FoulEvent"
import { ScoreEvent } from "./ScoreEvent"
import { SubstitutionEvent } from "./SubstitutionEvent"
import { KafkaMessage } from "kafkajs"
import { Event } from "./Event"

enum TOPICS {
  Fouls = 'Fouls',
  Score = 'Score',
  Substitutions = 'Substitutions'
}

export const eventFactory = (topic: string, message: KafkaMessage): Event | undefined => {
  switch(topic) {
    case TOPICS.Fouls:
      return new FoulEvent(message)
    case TOPICS.Score:
      return new ScoreEvent(message)
    case TOPICS.Substitutions:
      return new SubstitutionEvent(message)
  }
}
