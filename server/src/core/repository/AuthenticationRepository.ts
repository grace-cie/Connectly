import { LoginDto } from '../dto/Login.dto';

export interface AuthenticationRepository {
  login(loginDto: LoginDto): Promise<void>;
}
