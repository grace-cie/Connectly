import { Error } from "../../core/entity/Error.entity";
import { User } from "../../core/entity/User.entity";
import { UserRepository } from "../../core/repository/UserRepository";
import { getDatabase } from "../../middleware/MongoDB";
import { ObjectId } from "mongodb"; // Import ObjectId for querying by _id

export class UserRepositoryImpl implements UserRepository {
  private collection = getDatabase().collection("Users");

  async save(user: User): Promise<void> {
    await this.collection.insertOne(user);
  }

  async findById(id: string): Promise<User | null> {
    const userDocument = await this.collection.findOne({
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

  async getAllUsers(): Promise<User> {
    const userDocument = await this.collection.find({}).toArray();
    // console.log(userDocument);

    let user!: User;

    userDocument.forEach(function (value) {
      user = {
        id: value["_id"].toString(),
        name: value["name"],
        userName: value["userName"],
      };
    });

    return user;
  }
}
