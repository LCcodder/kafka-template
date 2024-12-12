import { HasMany, Column, Model, Table, AutoIncrement, PrimaryKey, DataType, ForeignKey, BelongsTo, BelongsToMany } from "sequelize-typescript";
import { Game } from "./Game";


@Table({
  timestamps: false,
  tableName: "teams"
})
export class Team extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.BIGINT.UNSIGNED
  })
  declare id: number

  @Column({
    type: DataType.STRING(16)
  })
  declare name: string

  // @BelongsToMany(() => Game, 'teams', 'team_one_id', 'team_two_id')
  // games: Game[]
}