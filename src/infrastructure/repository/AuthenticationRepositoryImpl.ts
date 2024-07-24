import { LoginDto } from "../../core/dto/Auth/Login.dto";
import { AuthenticationRepository } from "../../core/repository/AuthenticationRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDatabase } from "../../middleware/MongoDB";
import { ObjectId } from "mongodb";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";
import { LoggedDataEntity } from "../../core/entity/LoggedData.entity";
import { User } from "../../core/entity/User.entity";
import { Either, makeLeft, makeRight } from "../../utils/Either";

export class AuthenticationRepositoryImpl implements AuthenticationRepository {
  private userCollection = getDatabase().collection("Users");

  async login(
    loginDto: LoginDto
  ): Promise<Either<ErrorResponse, LoggedDataEntity>> {
    const userName = loginDto.userName;
    const password = loginDto.password;

    try {
      let errorResponse!: ErrorResponse;

      const user = await this.userCollection.findOne({ userName });

      if (!user || !user.password) {
        errorResponse = {
          statusCode: 401,
          errorMessage: "Invalid credentials",
        };

        return makeLeft(errorResponse);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        errorResponse = {
          statusCode: 401,
          errorMessage: "Wrong password",
        };
        return makeLeft(errorResponse);
      }

      const token = jwt.sign(
        { username: userName },
        process.env.ACCESS_TOKEN_SECRET || "defaultsecret",
        {
          expiresIn: "1h",
        }
      );

      const userDocument = await this.userCollection.findOne({
        _id: new ObjectId(user._id),
      });

      if (!userDocument) {
        errorResponse = {
          statusCode: 404,
          errorMessage: "User not found",
        };
        return makeLeft(errorResponse);
      }

      const userData: User = {
        id: userDocument._id.toString(),
        name: userDocument.name,
        userName: userDocument.userName,
      };

      const loggeData: LoggedDataEntity = {
        statusCode: 200,
        token: token,
        user: userData,
      };
      return makeRight(loggeData);
    } catch (error) {
      const errorResponse: ErrorResponse = {
        statusCode: 401,
        errorMessage: "Invalid credentials",
      };

      return makeLeft(errorResponse);
    }
  }
}
