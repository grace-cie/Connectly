import { RegisterUserDto } from "../dto/RegisterUser.dto";
import { ErrorResponse } from "../entity/ErrorRespose.entity";
import { User } from "../entity/User.entity";

export interface UserRepository {
  registerUser(newUserData: RegisterUserDto): Promise<string | ErrorResponse>;
  findById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
}
