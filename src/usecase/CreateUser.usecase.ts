import { RegisterUserDto } from "../core/dto/Auth/RegisterUser.dto";
import { ErrorResponse } from "../core/entity/ErrorRespose.entity";
import { UserRepository } from "../core/repository/UserRepository";
import { Either } from "../utils/Either";

export class CreateUserUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    name,
    userName,
    password,
    profilePicture,
  }: {
    name: string;
    userName: string;
    password: string;
    profilePicture: string;
  }): Promise<Either<ErrorResponse, string>> {
    const newUserData = new RegisterUserDto(
      name,
      userName,
      password,
      profilePicture
    );
    const result = await this.userRepository.registerUser(newUserData);
    return result;
  }
}
