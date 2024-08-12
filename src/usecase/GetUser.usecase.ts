import { ObjectId } from "mongodb";
import { User } from "../core/entity/User.entity";
import { UserRepository } from "../core/repository/UserRepository";
import { Either } from "../utils/Either";
import { ErrorResponse } from "../core/entity/ErrorRespose.entity";

export class GetUserUsecase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    user,
  }: {
    user: ObjectId;
  }): Promise<Either<ErrorResponse, User>> {
    const result = await this.userRepository.getUser(user);
    return result;
  }
}
