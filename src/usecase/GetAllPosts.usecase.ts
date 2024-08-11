import { ObjectId } from "mongodb";
import { ErrorResponse } from "../core/entity/ErrorRespose.entity";
import { PostsDto } from "../core/dto/Posts/Posts.dto";
import { PostsRepository } from "../core/repository/PostsRepository";
import { PostsResultDto } from "../core/dto/Posts/PostsResult.dto";
import { Either } from "../utils/Either";

export class GetAllPostsUsecase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    page,
  }: {
    page: number;
  }): Promise<Either<ErrorResponse, PostsResultDto>> {
    const result = await this.postsRepository.getAllPosts(page);
    return result;
  }
}
