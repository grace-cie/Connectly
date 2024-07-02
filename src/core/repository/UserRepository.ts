import { RegisterUserDto } from "../dto/RegisterUser.dto";
import { User } from "../entity/User.entity";

export interface UserRepository {
  registerUser(newUserData: RegisterUserDto): Promise<void>;
  findById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User>;
}
