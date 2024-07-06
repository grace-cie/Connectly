import { ObjectId } from "mongodb";
import { ErrorResponse } from "../core/entity/ErrorRespose.entity";
import { PostsDto } from "../core/dto/Posts/Posts.dto";
import { PostsRepository } from "../core/repository/PostsRepository";

export class GetMyPostsUsecase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    postedBy,
  }: {
    postedBy: string;
  }): Promise<PostsDto[] | ErrorResponse> {
    const result = await this.postsRepository.getMyPosts(postedBy);
    return result;
  }
}
