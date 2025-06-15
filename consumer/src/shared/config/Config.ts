import { P } from "pino";
import { logger } from "../utils/etc/PinoLogger";
import { IConfig } from "./IConfig";
require('dotenv').config()

export const CONFIG: IConfig = {
  botToken: process.env.BOT_TOKEN || "6605761193:AAGn6uzdsdmHnAJcaWi8mrskz0esrCCcbuo",
  kafkaClustersConnections: [ process.env.KAFKA_CLUSTER || "localhost:29092"],
  dbName: process.env.DB_NAME || "basketball_aggregator",
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD || "robocopid12",
  dbHost: process.env.DB_HOST || "localhost",

  log() {
    logger.info(
      `Bot loaded with config:
      MySQL name: ${this.dbName}
      MySQL host: ${this.dbHost}
      MySQL user: ${this.dbUser}
      Kafka cluster: ${this.kafkaClustersConnections[0]}
      `
    )
  }
} as const