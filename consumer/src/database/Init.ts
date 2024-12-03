import { Sequelize } from "sequelize-typescript";
import { User } from "../models/User";
import { GameSubscription } from "../models/Subscriptions";

export const initDataSource = async (): Promise<Sequelize> => {
  const sequelize = new Sequelize({
    database: 'basketball_aggregator',
    dialect: 'mysql',
    username: 'root',
    password: 'robocopid12',
    storage: ':memory:',
    models: [User, GameSubscription],
  });
  await sequelize.sync()
  return sequelize
}
