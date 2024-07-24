import { LoginDto } from "../core/dto/Auth/Login.dto";
import { ErrorResponse } from "../core/entity/ErrorRespose.entity";
import { LoggedDataEntity } from "../core/entity/LoggedData.entity";
import { AuthenticationRepository } from "../core/repository/AuthenticationRepository";
import { Either } from "../utils/Either";

export class LoginUserUsecase {
  constructor(private authenticationRepository: AuthenticationRepository) {}

  async execute({
    userName,
    password,
  }: {
    userName: string;
    password: string;
  }): Promise<Either<ErrorResponse, LoggedDataEntity>> {
    const loginDto = new LoginDto(userName, password);
    const result = await this.authenticationRepository.login(loginDto);
    return result;
  }
}
