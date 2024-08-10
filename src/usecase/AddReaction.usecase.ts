import { ObjectId } from "mongodb";
import { ErrorResponse } from "../core/entity/ErrorRespose.entity";
import { PostsRepository } from "../core/repository/PostsRepository";
import { Either } from "../utils/Either";
import { ReactionDto } from "../core/dto/Posts/Reaction.dto";

export class AddReactionUsecase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    reactToPost,
    reactedBy,
    name,
    reactionType,
  }: {
    reactToPost: ObjectId;
    reactedBy: ObjectId;
    name: string;
    reactionType: string;
  }): Promise<Either<ErrorResponse, string>> {
    const reactionData = new ReactionDto(
      new ObjectId(),
      new ObjectId(reactedBy),
      name,
      reactionType,
      new Date()
    );
    const result = await this.postsRepository.addReaction(
      reactToPost,
      reactionData
    );

    return result;
  }
}
