import { LoginDto } from "../dto/Login.dto";
import { User } from "../entity/User.entity";

export interface AuthenticationRepository {
  login(loginDto: LoginDto): Promise<void>;
}
