import { LoginDto } from "../../core/dto/Login.dto";
import { AuthenticationRepository } from "../../core/repository/AuthenticationRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDatabase } from "../../middleware/MongoDB";
import { ObjectId } from "mongodb"; // Import ObjectId for querying by _id
import { User } from "../../core/entity/User.entity";

export class AuthenticationRepositoryImpl implements AuthenticationRepository {
  private collection = getDatabase().collection("Users");

  async login(loginDto: LoginDto): Promise<any> {
    const userName = loginDto.username;
    const password = loginDto.password;

    try {
      const user = await this.collection.findOne({ userName });

      if (!user || !user.password) {
        return { statusCode: 401, message: "Invalid credentials" };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return { statusCode: 401, message: "Invalid credentials" };
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.ACCESS_TOKEN_SECRET || "defaultsecret",
        {
          expiresIn: "1h",
        }
      );

      return { statusCode: 500, token: token };
    } catch (error) {
      return { statusCode: 500, message: "Internal server error" };
    }
  }
}
