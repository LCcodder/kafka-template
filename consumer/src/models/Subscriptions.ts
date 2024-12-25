import { Column, Model, Table, AutoIncrement, PrimaryKey, DataType, ForeignKey } from "sequelize-typescript";
import { User } from "./User";
import { InferAttributes, InferCreationAttributes } from "sequelize";
import { Game } from "./Game";
import { Team } from "./Team";


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
  @ForeignKey(() => Game)
  game_id!: string
}

@Table({
  timestamps: false,
  tableName: "users_subscriptions_teams"
})
export class TeamSubscription extends Model<InferAttributes<TeamSubscription>, InferCreationAttributes<TeamSubscription>> {
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
  @ForeignKey(() => Team)
  team_id!: string
}