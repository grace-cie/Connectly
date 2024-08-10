import { ObjectId } from "mongodb";
import { ErrorResponse } from "../core/entity/ErrorRespose.entity";
import { PostsRepository } from "../core/repository/PostsRepository";
import { Either } from "../utils/Either";

export class DeletePostUsecase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    postId,
    deleteByUser,
  }: {
    postId: ObjectId;
    deleteByUser: ObjectId;
  }): Promise<Either<ErrorResponse, string>> {
    const result = await this.postsRepository.deletePost(postId, deleteByUser);
    return result;
  }
}
