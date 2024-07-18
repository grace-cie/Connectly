import { Collection } from "mongodb";
import { Conversation } from "../../core/dto/Chat/Conversation.dto";
import { MessageDto } from "../../core/dto/Chat/Message.dto";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";
import { ChatRepository } from "../../core/repository/ChatRepository";
import { getDatabase } from "../../middleware/MongoDB";
import { Conversations } from "../../core/dto/Chat/Conversations.dto";

export class ChatRepositoryImpl implements ChatRepository {
  private conversationCollection: Collection<Conversation> =
    getDatabase().collection("Conversation");
  private conversationsCollection: Collection<Conversations> =
    getDatabase().collection("Conversations");
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

    const conversationId = senderConvo?._id ?? recipientConvo?._id;

    // Updating the existing conversation
    if (existingConversation) {
      try {
        // find conversation with conversationId
        const result = await this.conversationCollection.findOne({
          _id: conversationId,
        });

        // update the conversations with the conversationsId property
        await this.conversationsCollection.updateOne(
          {
            _id: result?.conversationsId,
          },
          { $push: { conversationsList: messageDto } }
        );

        // update the last message
        await this.conversationCollection.updateOne(
          {
            _id: conversationId,
          },
          { $set: { lastMessage: messageDto.content } }
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
      const conversationsData: Conversations = {
        conversationsList: [messageDto],
      };
      const result = await this.conversationsCollection.insertOne(
        conversationsData
      );
      const conversationData: Conversation = {
        sender: messageDto.sender,
        recipient: messageDto.recipient,
        lastMessage: messageDto.content,
        conversationsId: result.insertedId,
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
