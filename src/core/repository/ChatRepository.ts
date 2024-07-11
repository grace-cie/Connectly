import { MessageDto } from "../dto/Chat/Message.dto";
import { ErrorResponse } from "../entity/ErrorRespose.entity";

export interface ChatRepository {
  sendMessage(messageDto: MessageDto): Promise<string | ErrorResponse>;
}
