import { User } from "../core/entity/User.entity";
import { UserRepository } from "../core/repository/UserRepository";

export class GetUsersUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<any> {
    const result = await this.userRepository.getAllUsers();
    return result;
  }
}
