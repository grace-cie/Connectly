import { LoginDto } from "../../core/dto/Login.dto";
import { AuthenticationRepository } from "../../core/repository/AuthenticationRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDatabase } from "../../middleware/MongoDB";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";
import { LoggedDataEntity } from "../../core/entity/LoggedData.entity";

export class AuthenticationRepositoryImpl implements AuthenticationRepository {
  private collection = getDatabase().collection("Users");

  async login(loginDto: LoginDto): Promise<LoggedDataEntity | ErrorResponse> {
    const userName = loginDto.userName;
    const password = loginDto.password;

    try {
      let errorResponse!: ErrorResponse;

      const user = await this.collection.findOne({ userName });

      if (!user || !user.password) {
        errorResponse = {
          statusCode: 401,
          errorMessage: "Invalid credentials",
        };

        return errorResponse;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      console.log(`pass valid ${isPasswordValid}`);

      if (!isPasswordValid) {
        errorResponse = {
          statusCode: 401,
          errorMessage: "Wrong password",
        };
        return errorResponse;
      }

      const token = jwt.sign(
        { username: userName },
        process.env.ACCESS_TOKEN_SECRET || "defaultsecret",
        {
          expiresIn: "1h",
        }
      );

      const loggeData: LoggedDataEntity = {
        statusCode: 200,
        token: token,
      };
      return loggeData;
    } catch (error) {
      const errorResponse: ErrorResponse = {
        statusCode: 401,
        errorMessage: "Invalid credentials",
      };

      return errorResponse;
    }
  }
}
