import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Index,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript'

@Table({
  tableName: 'games',
  timestamps: false,
})

export class Games extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: string

  @Column
  title: string

  @Column
  app_id: number

  @CreatedAt
  @Column
  created_at: Date

  @UpdatedAt
  @Column
  updated_at: Date
}
