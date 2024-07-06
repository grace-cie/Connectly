import { LoginDto } from "../dto/Auth/Login.dto";
import { ErrorResponse } from "../entity/ErrorRespose.entity";
import { LoggedDataEntity } from "../entity/LoggedData.entity";
import { User } from "../entity/User.entity";

export interface AuthenticationRepository {
  login(loginDto: LoginDto): Promise<LoggedDataEntity | ErrorResponse>;
}
