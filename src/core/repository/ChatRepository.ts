import { ObjectId } from "mongodb";
import { Conversation } from "../dto/Chat/Conversation.dto";
import { MessageDto } from "../dto/Chat/Message.dto";
import { ErrorResponse } from "../entity/ErrorRespose.entity";
import { ConversationsResultDto } from "../dto/Chat/ConversationsResult.dto";
import { Either } from "../../utils/Either";

export interface ChatRepository {
  sendMessage(messageDto: MessageDto): Promise<Either<ErrorResponse, string>>;
  getConversation(
    userName: string
  ): Promise<Either<ErrorResponse, Conversation[]>>;
  getConversations(
    conversationsId: ObjectId,
    page: number
  ): Promise<Either<ErrorResponse, ConversationsResultDto>>;
}
