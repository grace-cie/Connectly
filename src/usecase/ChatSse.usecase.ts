import { Response } from "express";
import { MessageDto } from "../core/dto/Chat/Message.dto";
import { ChatRepository } from "../core/repository/ChatRepository";
import { ErrorResponse } from "../core/entity/ErrorRespose.entity";
import { Either, isRight, unwrapEither } from "../utils/Either";

// interface Message {
//   sender: string;
//   recipient: string;
//   content: string;
// }

export class ChatSseUsecase {
  constructor(private chatRepository: ChatRepository) {}
  private clients: Map<string, Response[]> = new Map();

  async addClient({
    username,
    client,
  }: {
    username: string;
    client: Response;
  }) {
    if (!this.clients.has(username)) {
      this.clients.set(username, []);
    }
    this.clients.get(username)?.push(client);
  }

  async removeClient(username: string, client: Response) {
    const userClients = this.clients.get(username);
    if (userClients) {
      this.clients.set(
        username,
        userClients.filter((c: Response) => c !== client)
      );
      if (this.clients.get(username)?.length === 0) {
        this.clients.delete(username);
      }
    }
  }

  async sendMessage({
    message,
  }: {
    message: MessageDto;
  }): Promise<Either<ErrorResponse, string>> {
    const { sender, recipient, sentAt, content } = message;

    // Send message to the recipient
    const recipientClients = this.clients.get(recipient);
    // Send message to the sender
    const senderClients = this.clients.get(sender);

    const result = await this.chatRepository.sendMessage(message);

    if (isRight(result)) {
      if (recipientClients) {
        recipientClients.forEach((client: Response) => {
          client.write(
            `data: ${JSON.stringify({ sender, sentAt, content })}\n\n`
          );
        });
      }

      if (senderClients) {
        senderClients.forEach((client: Response) => {
          client.write(
            `data: ${JSON.stringify({ sender, sentAt, content })}\n\n`
          );
        });
      }
    }

    return result;
  }
}
