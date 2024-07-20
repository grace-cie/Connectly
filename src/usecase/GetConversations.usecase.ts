import { ObjectId } from "mongodb";
import { ErrorResponse } from "../core/entity/ErrorRespose.entity";

import { ChatRepository } from "../core/repository/ChatRepository";
import { ConversationsResultDto } from "../core/dto/Chat/ConversationsResult.dto";

export class GetConversationsUsecase {
  constructor(private chatRepository: ChatRepository) {}

  async execute({
    conversationsId,
    page,
  }: {
    conversationsId: ObjectId;
    page: number;
  }): Promise<ConversationsResultDto | ErrorResponse> {
    const result = await this.chatRepository.getConversations(
      conversationsId,
      page
    );
    return result;
  }
}
