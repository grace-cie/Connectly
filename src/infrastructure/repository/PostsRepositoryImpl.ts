import { ObjectId } from "mongodb";
import { PostsDto } from "../../core/dto/Posts/Posts.dto";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";
import { PostsRepository } from "../../core/repository/PostsRepository";
import { getDatabase } from "../../middleware/MongoDB";
import { title } from "process";

export class PostsRepositoryImpl implements PostsRepository {
  private postsCollection = getDatabase().collection("Posts");

  async createPost(postData: PostsDto): Promise<string | ErrorResponse> {
    try {
      await this.postsCollection.insertOne(postData);
      return "created";
    } catch (e) {
      const error: ErrorResponse = {
        statusCode: 400,
        errorMessage: e?.toString() ?? "",
      };
      return error;
    }
  }

  async getMyPosts(postedBy: string): Promise<PostsDto[] | ErrorResponse> {
    try {
      console.log(`pusted:  ${postedBy}`);
      let posts!: PostsDto[];

      const postDocument = await this.postsCollection
        .find({
          postedBy: postedBy,
        })
        .toArray();

      posts = postDocument.map((doc) => ({
        id: doc["_id"].toString(),
        postedBy: doc["postedBy"],
        title: doc["title"],
        body: doc["body"],
        likes: doc["likes"],
        comments: doc["comments"],
      }));

      return posts;
    } catch (e) {
      const error: ErrorResponse = {
        statusCode: 404,
        errorMessage: e?.toString() ?? "",
      };

      return error;
    }
  }
}
