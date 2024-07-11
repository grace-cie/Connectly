import { Collection } from "mongodb";
import { Conversation } from "../../core/dto/Chat/Conversation.dto";
import { MessageDto } from "../../core/dto/Chat/Message.dto";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";
import { ChatRepository } from "../../core/repository/ChatRepository";
import { getDatabase } from "../../middleware/MongoDB";

export class ChatRepositoryImpl implements ChatRepository {
  private conversationCollection: Collection<Conversation> =
    getDatabase().collection("Conversation");
  private userCollection = getDatabase().collection("Users");

  async sendMessage(messageDto: MessageDto): Promise<string | ErrorResponse> {
    let errorResponse!: ErrorResponse;

    // Check if both sender and recipient are valid users
    const sender = await this.userCollection.findOne({
      userName: messageDto.sender,
    });
    const recipient = await this.userCollection.findOne({
      userName: messageDto.recipient,
    });

    if (!sender || !recipient) {
      errorResponse = {
        statusCode: 400,
        errorMessage: `${!sender ? "Sender" : "Recipient"} is invalid`,
      };
      return errorResponse;
    }

    // sender is sender
    const senderConvo = await this.conversationCollection.findOne({
      sender: messageDto.sender,
      recipient: messageDto.recipient,
    });

    // recipient is sender
    const recipientConvo = await this.conversationCollection.findOne({
      sender: messageDto.recipient,
      recipient: messageDto.sender,
    });

    // Checking if there's an existing record of the two users
    const existingConversation = senderConvo || recipientConvo;

    // Updating the existing conversation
    if (existingConversation) {
      try {
        await this.conversationCollection.updateOne(
          {
            sender: !senderConvo ? messageDto.recipient : messageDto.sender,
            recipient: !senderConvo ? messageDto.sender : messageDto.recipient,
          },
          { $push: { conversationList: messageDto } }
        );
        return "Message Sent";
      } catch (e) {
        errorResponse = {
          statusCode: 500,
          errorMessage: `Message Not Sent! : ${e}`,
        };
        return errorResponse;
      }
    }

    // Create a new conversation
    try {
      const conversationData: Conversation = {
        sender: messageDto.sender,
        recipient: messageDto.recipient,
        conversationList: [messageDto],
      };
      await this.conversationCollection.insertOne(conversationData);
      return "Message Sent";
    } catch (e) {
      errorResponse = {
        statusCode: 500,
        errorMessage: `Message Not Sent! : ${e}`,
      };
      return errorResponse;
    }
  }
}
