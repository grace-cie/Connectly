import { ObjectId } from "mongodb";
import { ErrorResponse } from "../core/entity/ErrorRespose.entity";
import { PostsRepository } from "../core/repository/PostsRepository";
import { Either } from "../utils/Either";

export class DeleteCommentUsecase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    commentId,
    commentIdOnList,
    deleteByUser,
  }: {
    commentId: ObjectId;
    commentIdOnList: ObjectId;
    deleteByUser: ObjectId;
  }): Promise<Either<ErrorResponse, string>> {
    const result = await this.postsRepository.deleteComment(
      commentId,
      commentIdOnList,
      deleteByUser
    );
    return result;
  }
}
