import { Sequelize } from "sequelize-typescript";
import { User } from "../models/User";
import { GameSubscription } from "../models/Subscriptions";
import { Game } from "../models/Game";
import { Team } from "../models/Team";

export const initDataSource = async (): Promise<Sequelize> => {
  const sequelize = new Sequelize({
    database: 'basketball_aggregator',
    dialect: 'mysql',
    username: 'root',
    password: 'robocopid12',
    models: [User, GameSubscription, Team, Game],  
  });
  await sequelize.sync()
  return sequelize
}
