import { RegisterUserDto } from "../../core/dto/RegisterUser.dto";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";
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
  }): Promise<string | ErrorResponse> {
    const newUserData = new RegisterUserDto(name, userName, password);
    const result = await this.userRepository.registerUser(newUserData);
    return result;
  }
}
