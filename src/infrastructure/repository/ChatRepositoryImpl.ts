import { Collection, ObjectId } from "mongodb";
import { Conversation } from "../../core/dto/Chat/Conversation.dto";
import { MessageDto } from "../../core/dto/Chat/Message.dto";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";
import { ChatRepository } from "../../core/repository/ChatRepository";
import { getDatabase } from "../../middleware/MongoDB";
import { Conversations } from "../../core/dto/Chat/Conversations.dto";
import { ConversationsResultDto } from "../../core/dto/Chat/ConversationsResult.dto";
import { Either, makeLeft, makeRight } from "../../utils/Either";

export class ChatRepositoryImpl implements ChatRepository {
  private conversationCollection: Collection<Conversation> =
    getDatabase().collection("Conversation");
  private conversationsCollection: Collection<Conversations> =
    getDatabase().collection("Conversations");
  private userCollection = getDatabase().collection("Users");

  async sendMessage(
    messageDto: MessageDto
  ): Promise<Either<ErrorResponse, string>> {
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
      return makeLeft(errorResponse);
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
        return makeRight("Message Sent");
      } catch (e) {
        errorResponse = {
          statusCode: 500,
          errorMessage: `Message Not Sent! : ${e}`,
        };
        return makeLeft(errorResponse);
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
      return makeRight("Message Sent");
    } catch (e) {
      errorResponse = {
        statusCode: 500,
        errorMessage: `Message Not Sent! : ${e}`,
      };
      return makeLeft(errorResponse);
    }
  }

  async getConversation(
    userName: string
  ): Promise<Either<ErrorResponse, Conversation[]>> {
    let conversationList: Conversation[];
    let errorResponse!: ErrorResponse;

    // Fetch conversations where the user is the sender
    const sender = await this.conversationCollection
      .find({
        sender: userName,
      })
      .toArray();

    // Fetch conversations where the user is the recipient
    const recipient = await this.conversationCollection
      .find({
        recipient: userName,
      })
      .toArray();

    // Combine the results from both queries
    const foundConversation = [...sender, ...recipient];

    // If conversations are found, map them to the Conversation interface
    if (foundConversation != null) {
      conversationList = foundConversation.map((doc) => ({
        sender: doc["sender"],
        recipient: doc["recipient"],
        lastMessage: doc["lastMessage"],
        conversationsId: doc["conversationsId"],
      }));

      // Return the list of conversations
      return makeRight(conversationList);
    } else {
      // If no conversations are found, return an error response
      errorResponse = {
        statusCode: 404,
        errorMessage: `Conversation Not Found!`,
      };
      return makeLeft(errorResponse);
    }
  }

  async getConversations(
    conversationsId: ObjectId,
    page: number,
    pageSize: number = 10 // Default page size
  ): Promise<Either<ErrorResponse, ConversationsResultDto>> {
    let conversationsResult: ConversationsResultDto;
    let errorResponse!: ErrorResponse;

    // Convert the input conversationsId to an ObjectId instance
    const finalConversationsId = new ObjectId(conversationsId);

    try {
      // Fetch the conversation document from the collection using the finalConversationsId
      const conversation = await this.conversationsCollection.findOne({
        _id: finalConversationsId,
      });

      // If the conversation document is not found, return an error response
      if (!conversation) {
        errorResponse = {
          statusCode: 404,
          errorMessage: "Conversations Record Not Found!",
        };
        return makeLeft(errorResponse);
      }

      // Calculate the total number of items and the maximum number of pages
      const totalItems = conversation.conversationsList.length;
      const maxPage = Math.ceil(totalItems / pageSize);

      // If the requested page number exceeds the maximum pages, return an error response
      if (page > maxPage) {
        errorResponse = {
          statusCode: 404,
          errorMessage: "Page number exceeds maximum pages",
        };
        return makeLeft(errorResponse);
      }

      // Calculate the starting index for the current page
      const skip = (page - 1) * pageSize;

      // Slice the conversationsList to get only the items for the current page
      const pagedConversationList = conversation.conversationsList
        .slice(skip, skip + pageSize)
        .map(
          (message: any) =>
            new MessageDto(
              message.sender,
              message.recipient,
              new Date(message.sentAt), // Convert sentAt to Date object
              message.content
            )
        );

      // Create the result object with the current page, maxPage, and paged conversation list
      conversationsResult = {
        currentPage: page,
        maxPage: maxPage,
        conversationsList: pagedConversationList,
      };

      // Return the result object
      return makeRight(conversationsResult);
    } catch (error) {
      // In case of any error, create and return an error response with status code 500
      errorResponse = {
        statusCode: 500,
        errorMessage: `An error occurred while retrieving conversations: ${error}`,
      };
      return makeLeft(errorResponse);
    }
  }
}
