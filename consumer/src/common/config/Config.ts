import { IConfig } from "./IConfig";
require('dotenv').config()

export const CONFIG: IConfig = {
  botToken: process.env.BOT_TOKEN || "<token>",
  kafkaClustersConnections: ["localhost:9290"],
  dbName: process.env.DB_NAME || "basketball_aggregator",
  dbUser: process.env.DB_USER || "root",
  dbPassword: process.env.DB_PASSWORD || "robocopid12",
  dbHost: process.env.DB_HOST || "localhost",
  log() {
    console.log(
      `
      Bot loaded with config:
      db name: ${this.dbName}
      db host: ${this.dbHost}
      db user: ${this.dbUser}
      `
    )
  }
} as const