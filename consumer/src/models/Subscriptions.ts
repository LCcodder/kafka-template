import { Column, Model, Table, AutoIncrement, PrimaryKey, DataType, ForeignKey } from "sequelize-typescript";
import { User } from "./User";
import { InferAttributes, InferCreationAttributes } from "sequelize";


@Table({
  timestamps: false,
  tableName: "users_subscriptions_games"
})
export class GameSubscription extends Model<InferAttributes<GameSubscription>, InferCreationAttributes<GameSubscription>> {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.BIGINT
  })
  declare id: number

  @Column({
    type: DataType.STRING(16)
  })
  @ForeignKey(() => User)
  user_id!: string

  @Column({type: DataType.BIGINT})
  game_id!: string
}