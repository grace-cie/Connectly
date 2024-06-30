import { User } from '../../core/entity/User.entity';
import { UserRepository } from '../../core/repository/UserRepository';

export class CreateUserUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, name: string): Promise<void> {
    const user = new User(id, name);
    await this.userRepository.save(user);
  }
}
