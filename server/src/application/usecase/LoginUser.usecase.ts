import { LoginDto } from '../../core/dto/Login.dto';
import { AuthenticationRepository } from '../../core/repository/AuthenticationRepository';

export class LoginUserUsecase {
  constructor(private authernticationRepository: AuthenticationRepository) {}

  async execute(username: string, password: string): Promise<void> {
    const loginDto = new LoginDto(username, password);
    await this.authernticationRepository.login(loginDto);
  }
}
