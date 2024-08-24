import { ObjectId } from "mongodb";
import { ErrorResponse } from "../core/entity/ErrorRespose.entity";
import { PostsRepository } from "../core/repository/PostsRepository";
import { Either } from "../utils/Either";
import { CommentDto } from "../core/dto/Posts/Comment.dto";

export class EditCommentUsecase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    commentId,
    editByUser,
    /// comment data
    commentOnListId,
    commentBy,
    name,
    comment,
  }: {
    commentId: ObjectId;
    editByUser: ObjectId;
    /// comment data
    commentOnListId: ObjectId;
    commentBy: ObjectId;
    name: string;
    comment: string;
  }): Promise<Either<ErrorResponse, string>> {
    const commentData = new CommentDto(
      new ObjectId(commentOnListId),
      new ObjectId(commentBy),
      name,
      comment,
      new Date()
    );
    const result = await this.postsRepository.editComment(
      commentId,
      editByUser,
      commentData
    );
    return result;
  }
}
