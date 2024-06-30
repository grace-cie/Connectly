import { User } from '../../core/entity/User.entity';
import { UserRepository } from '../../core/repository/UserRepository';
import { getDatabase } from '../../middleware/MongoDB';
import { ObjectId } from 'mongodb'; // Import ObjectId for querying by _id

export class UserRepositoryImpl implements UserRepository {
  private collection = getDatabase().collection('users');

  async save(user: User): Promise<void> {
    await this.collection.insertOne(user);
  }

  async findById(id: string): Promise<User | null> {
    const userDocument = await this.collection.findOne({ _id: new ObjectId(id) });

    if (!userDocument) {
      return null;
    }

    // Map MongoDB document to User entity
    const user: User = {
      id: userDocument._id.toString(), // Assuming id is stored as string in your User entity
      name: userDocument.name, // Adjust as per your User entity structure
    };

    return user;
  }
}
