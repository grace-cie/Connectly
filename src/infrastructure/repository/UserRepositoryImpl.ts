import { RegisterUserDto } from "../../core/dto/Auth/RegisterUser.dto";
import bcrypt from "bcryptjs";
import { User } from "../../core/entity/User.entity";
import { UserRepository } from "../../core/repository/UserRepository";
import { getDatabase } from "../../middleware/MongoDB";
import { ObjectId } from "mongodb"; // Import ObjectId for querying by _id
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";
import { Either, makeLeft, makeRight } from "../../utils/Either";

export class UserRepositoryImpl implements UserRepository {
  private userCollection = getDatabase().collection("Users");

  async registerUser(
    newUserData: RegisterUserDto
  ): Promise<Either<ErrorResponse, string>> {
    let errorResponse!: ErrorResponse;

    const existingUser = await this.userCollection.findOne({
      userName: newUserData.userName,
    });

    if (existingUser) {
      errorResponse = {
        statusCode: 401,
        errorMessage: "User already exist, Try another username",
      };

      return makeLeft(errorResponse);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newUserData.password, salt);

    const completeUserData: RegisterUserDto = {
      name: newUserData.name,
      userName: newUserData.userName,
      password: hashedPassword,
      profilePicture: newUserData.profilePicture,
    };

    await this.userCollection.insertOne(completeUserData);
    return makeRight("created");
  }

  async findById(id: string): Promise<User | null> {
    const userDocument = await this.userCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!userDocument) {
      return null;
    }

    const user: User = {
      id: userDocument._id.toString(),
      name: userDocument.name,
      userName: userDocument.userName,
    };

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const userDocument = await this.userCollection.find({}).toArray();

    let user!: User[];

    user = userDocument.map((doc) => ({
      id: doc["_id"].toString(),
      name: doc["name"],
      userName: doc["userName"],
    }));

    return user;
  }
}
