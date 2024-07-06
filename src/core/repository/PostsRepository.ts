import { PostsDto } from "../dto/Posts/Posts.dto";
import { ErrorResponse } from "../entity/ErrorRespose.entity";

export interface PostsRepository {
  createPost(postData: PostsDto): Promise<string | ErrorResponse>;
  getMyPosts(postedBy: string): Promise<PostsDto[] | ErrorResponse>;
}
