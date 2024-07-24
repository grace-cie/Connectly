import { Either } from "../../utils/Either";
import { RegisterUserDto } from "../dto/Auth/RegisterUser.dto";
import { ErrorResponse } from "../entity/ErrorRespose.entity";
import { User } from "../entity/User.entity";

export interface UserRepository {
  registerUser(
    newUserData: RegisterUserDto
  ): Promise<Either<ErrorResponse, string>>;
  findById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
}
