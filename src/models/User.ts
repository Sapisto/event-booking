import { Table, Column, Model, DataType, Default } from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

@Table({ tableName: "users" })
export class User extends Model {
  @Default(uuidv4)
  @Column({ type: DataType.UUID, primaryKey: true, allowNull: false })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
    defaultValue: UserRole.USER,
  })
  role!: UserRole;
}
