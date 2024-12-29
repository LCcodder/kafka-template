export interface IConfig {
  botToken: string
  kafkaClustersConnections: string[]
  dbName: string
  dbUser: string
  dbPassword: string
  dbHost: string
  
  log(): void
}