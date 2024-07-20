import { ObjectId } from "mongodb";
import { Conversation } from "../dto/Chat/Conversation.dto";
import { MessageDto } from "../dto/Chat/Message.dto";
import { ErrorResponse } from "../entity/ErrorRespose.entity";
import { ConversationsResultDto } from "../dto/Chat/ConversationsResult.dto";

export interface ChatRepository {
  sendMessage(messageDto: MessageDto): Promise<string | ErrorResponse>;
  getConversation(userName: string): Promise<Conversation[] | ErrorResponse>;
  getConversations(
    conversationsId: ObjectId,
    page: number
  ): Promise<ConversationsResultDto | ErrorResponse>;
}
