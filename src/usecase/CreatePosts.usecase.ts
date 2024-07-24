import { ObjectId } from "mongodb";
import { ErrorResponse } from "../core/entity/ErrorRespose.entity";
import { PostsDto } from "../core/dto/Posts/Posts.dto";
import { PostsRepository } from "../core/repository/PostsRepository";
import { Either } from "../utils/Either";

export class CreatePostUsecase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    postedBy,
    title,
    body,
  }: {
    postedBy: ObjectId;
    title: string;
    body: string;
  }): Promise<Either<ErrorResponse, string>> {
    const newPostData = new PostsDto(postedBy, title, body);
    const result = await this.postsRepository.createPost(newPostData);
    return result;
  }
}
