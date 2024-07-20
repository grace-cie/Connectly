import { PostsDto } from "../dto/Posts/Posts.dto";
import { PostsResultDto } from "../dto/Posts/PostsResult.dto";
import { ErrorResponse } from "../entity/ErrorRespose.entity";

export interface PostsRepository {
  createPost(postData: PostsDto): Promise<string | ErrorResponse>;
  getMyPosts(
    postedBy: string,
    page: number
  ): Promise<PostsResultDto | ErrorResponse>;
}
