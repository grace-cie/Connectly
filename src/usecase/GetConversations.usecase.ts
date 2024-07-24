import { ObjectId } from "mongodb";
import { ErrorResponse } from "../core/entity/ErrorRespose.entity";
import { ChatRepository } from "../core/repository/ChatRepository";
import { ConversationsResultDto } from "../core/dto/Chat/ConversationsResult.dto";
import { Either } from "../utils/Either";

export class GetConversationsUsecase {
  constructor(private chatRepository: ChatRepository) {}

  async execute({
    conversationsId,
    page,
  }: {
    conversationsId: ObjectId;
    page: number;
  }): Promise<Either<ErrorResponse, ConversationsResultDto>> {
    const result = await this.chatRepository.getConversations(
      conversationsId,
      page
    );
    return result;
  }
}
