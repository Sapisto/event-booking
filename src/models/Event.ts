import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./User"; 

@Table({ tableName: "events" })
export class Event extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  eventId!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  eventName!: string;

  @Column({ type: DataType.DATE, allowNull: false })
  eventDate!: Date;

  @Column({ type: DataType.INTEGER, allowNull: false })
  totalTickets!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  availableTickets!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  createdBy!: number;

  @BelongsTo(() => User)
  createdByUser!: User;
  
}
