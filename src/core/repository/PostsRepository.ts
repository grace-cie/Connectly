import { Either } from "../../utils/Either";
import { PostsDto } from "../dto/Posts/Posts.dto";
import { PostsResultDto } from "../dto/Posts/PostsResult.dto";
import { ErrorResponse } from "../entity/ErrorRespose.entity";

export interface PostsRepository {
  createPost(postData: PostsDto): Promise<Either<ErrorResponse, string>>;
  getMyPosts(
    postedBy: string,
    page: number
  ): Promise<Either<ErrorResponse, PostsResultDto>>;
}
