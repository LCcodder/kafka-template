import { Column, Model, Table, AutoIncrement, PrimaryKey, ForeignKey, HasMany, HasOne, DataType } from "sequelize-typescript";
import { GameSubscription } from "./Subscriptions";
import { Team } from "./Team";

@Table({
  timestamps: false,
  tableName: "games",
})
export class Game extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.BIGINT.UNSIGNED
  })
  declare id: number

  @Column({type: DataType.INTEGER})
  declare team_one_score: number

  @Column({type: DataType.INTEGER})
  declare team_two_score: number

  @Column({type: DataType.BIGINT.UNSIGNED})
  @ForeignKey(() => Team)
  declare team_one_id: number

  // @HasOne(() => Team, {
  //   foreignKey: 'team_one_id',
  //   sourceKey: 'id'
  // })
  // declare team_one: Team

  @Column({type: DataType.BIGINT.UNSIGNED})
  @ForeignKey(() => Team)
  declare team_two_id: number

  // @HasOne(() => Team, {
  //   foreignKey: 'team_two_id',
  //   sourceKey: 'id'
  // })
  // declare team_two: Team
  
  @Column({ type: DataType.BOOLEAN })
  declare is_ended: boolean

  @Column({ type: DataType.TIME })
  declare created_at: string
  
  @Column({ type: DataType.TIME })
  declare updated_at?: string

  @HasMany(() => GameSubscription)
  declare subscriptions: GameSubscription[]
}