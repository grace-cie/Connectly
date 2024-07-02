import { RegisterUserDto } from "../../core/dto/RegisterUser.dto";
import { User } from "../../core/entity/User.entity";
import { UserRepository } from "../../core/repository/UserRepository";

export class CreateUserUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    name,
    userName,
    password,
  }: {
    name: string;
    userName: string;
    password: string;
  }): Promise<void> {
    const newUserData = new RegisterUserDto(name, userName, password);
    await this.userRepository.registerUser(newUserData);
  }
}
