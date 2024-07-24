import { Conversation } from "../core/dto/Chat/Conversation.dto";
import { ErrorResponse } from "../core/entity/ErrorRespose.entity";

import { ChatRepository } from "../core/repository/ChatRepository";
import { Either } from "../utils/Either";

export class GetConversationUsecase {
  constructor(private chatRepository: ChatRepository) {}

  async execute({
    userName,
  }: {
    userName: string;
  }): Promise<Either<ErrorResponse, Conversation[]>> {
    const result = await this.chatRepository.getConversation(userName);
    return result;
  }
}
