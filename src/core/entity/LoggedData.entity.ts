import { User } from "./User.entity";

export class LoggedDataEntity {
  constructor(
    public statusCode: number,
    public token: string,
    public user: User
  ) {}
}
