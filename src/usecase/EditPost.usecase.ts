import { ObjectId } from "mongodb";
import { ErrorResponse } from "../core/entity/ErrorRespose.entity";
import { PostsRepository } from "../core/repository/PostsRepository";
import { Either } from "../utils/Either";
import { PostsDto } from "../core/dto/Posts/Posts.dto";

export class EditPostUsecase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    postId,
    editByUser,
    /// post data
    title,
    body,
  }: {
    postId: ObjectId;
    editByUser: ObjectId;
    /// post data
    title: string;
    body: string;
  }): Promise<Either<ErrorResponse, string>> {
    const postData = new PostsDto(
      new ObjectId(),
      new ObjectId(),
      title,
      body,
      new Date(),
      [],
      []
    );
    const result = await this.postsRepository.editPost(
      postId,
      editByUser,
      postData
    );
    return result;
  }
}
