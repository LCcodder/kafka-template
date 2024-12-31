import { Sequelize } from "sequelize-typescript";
import { User } from "../models/User";
import { GameSubscription, TeamSubscription } from "../models/Subscriptions";
import { Game } from "../models/Game";
import { Team } from "../models/Team";
import { CONFIG } from "../shared/config/Config";

export const initDataSource = async (): Promise<Sequelize> => {
  const sequelize = new Sequelize({
    database: CONFIG.dbName,
    dialect: 'mysql',
    username: CONFIG.dbUser,
    password: CONFIG.dbPassword,
    models: [User, GameSubscription, TeamSubscription, Team, Game],  
    host: CONFIG.dbHost
  });
  
  await sequelize.sync()
  return sequelize
}
