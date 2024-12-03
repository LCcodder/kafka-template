import { Model, PrimaryKey, Column, DataType, HasMany, Table } from "sequelize-typescript";
import { GameSubscription } from "./Subscriptions";

@Table({
  timestamps: false,
  tableName: "users"
})
export class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING(16)
  })
  declare id: string

  @HasMany(() => GameSubscription)
  gameSubscriptions: GameSubscription[]
}