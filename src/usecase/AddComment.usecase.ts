import { ObjectId } from "mongodb";
import { ErrorResponse } from "../core/entity/ErrorRespose.entity";
import { PostsRepository } from "../core/repository/PostsRepository";
import { Either } from "../utils/Either";
import { CommentDto } from "../core/dto/Posts/Comment.dto";

export class AddCommentUsecase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    commentToPost,
    commentBy,
    name,
    comment,
  }: {
    commentToPost: ObjectId;
    commentBy: ObjectId;
    name: string;
    comment: string;
  }): Promise<Either<ErrorResponse, string>> {
    const commentData = new CommentDto(
      new ObjectId(),
      new ObjectId(commentBy),
      name,
      comment,
      new Date()
    );
    const result = await this.postsRepository.addComment(
      commentToPost,
      commentData
    );

    return result;
  }
}
