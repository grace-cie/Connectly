import { PostsDto } from "../../core/dto/Posts/Posts.dto";
import { PostsResultDto } from "../../core/dto/Posts/PostsResult.dto";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";
import { PostsRepository } from "../../core/repository/PostsRepository";
import { getDatabase } from "../../middleware/MongoDB";

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

  async getMyPosts(
    postedBy: string,
    page: number,
    pageSize: number = 10 // Default page size
  ): Promise<PostsResultDto | ErrorResponse> {
    let postsResult!: PostsResultDto;
    let errorResponse!: ErrorResponse;

    try {
      // Calculate the total number of documents matching the criteria
      const totalItems = await this.postsCollection.countDocuments({
        postedBy: postedBy,
      });

      // Calculate the maximum number of pages
      const maxPage = Math.ceil(totalItems / pageSize);

      // If the requested page number exceeds the maximum pages, return an error response
      if (page > maxPage) {
        errorResponse = {
          statusCode: 404,
          errorMessage: "Page number exceeds maximum pages",
        };
        return errorResponse;
      }

      // Calculate the number of documents to skip for the current page
      const skip = (page - 1) * pageSize;

      // Fetch the documents for the current page
      const postDocument = await this.postsCollection
        .find({
          postedBy: postedBy,
        })
        .skip(skip) // Skip the documents for previous pages
        .limit(pageSize) // Limit the number of documents to the page size
        .toArray();

      // Map the documents to PostsDto objects
      const posts = postDocument.map((doc) => ({
        id: doc["_id"].toString(),
        postedBy: doc["postedBy"],
        title: doc["title"],
        body: doc["body"],
        likes: doc["likes"],
        comments: doc["comments"],
      }));

      // Create the result object with the current page, maxPage, and paged posts list
      postsResult = {
        currentPage: page,
        maxPage: maxPage,
        postsList: posts,
      };

      new PostsResultDto(page, maxPage, posts);

      // Return the result object
      return postsResult;
    } catch (e) {
      // In case of any error, create and return an error response with status code 500
      errorResponse = {
        statusCode: 500,
        errorMessage: `An error occurred while retrieving posts: ${e}`,
      };
      return errorResponse;
    }
  }
}
