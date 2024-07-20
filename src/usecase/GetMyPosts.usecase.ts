import { ObjectId } from "mongodb";
import { ErrorResponse } from "../core/entity/ErrorRespose.entity";
import { PostsDto } from "../core/dto/Posts/Posts.dto";
import { PostsRepository } from "../core/repository/PostsRepository";
import { PostsResultDto } from "../core/dto/Posts/PostsResult.dto";

export class GetMyPostsUsecase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    postedBy,
    page,
  }: {
    postedBy: string;
    page: number;
  }): Promise<PostsResultDto | ErrorResponse> {
    const result = await this.postsRepository.getMyPosts(postedBy, page);
    return result;
  }
}
