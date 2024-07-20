import { Conversation } from "../core/dto/Chat/Conversation.dto";
import { ErrorResponse } from "../core/entity/ErrorRespose.entity";

import { ChatRepository } from "../core/repository/ChatRepository";

export class GetConversationUsecase {
  constructor(private chatRepository: ChatRepository) {}

  async execute({
    userName,
  }: {
    userName: string;
  }): Promise<Conversation[] | ErrorResponse> {
    const result = await this.chatRepository.getConversation(userName);
    return result;
  }
}
