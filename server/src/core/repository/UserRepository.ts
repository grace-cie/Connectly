import { User } from "../entity/User.entity";

export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User>;
}
