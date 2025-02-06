import { Table, Column, Model, ForeignKey, DataType } from "sequelize-typescript";
import { Event } from "./Event";
import { User } from "./User";

@Table({ tableName: "bookings" })
export class Booking extends Model {
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @ForeignKey(() => Event)
  @Column({ type: DataType.INTEGER, allowNull: false })
  eventId!: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  ticketsBooked!: number;
}
