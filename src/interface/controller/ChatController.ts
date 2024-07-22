import Joi from "joi";
import objectId from "../../utils/ObjectId";
import { Request, Response } from "express";
import { ChatSseUsecase } from "../../usecase/ChatSse.usecase";
import { MessageDto } from "../../core/dto/Chat/Message.dto";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";
import { Conversation } from "../../core/dto/Chat/Conversation.dto";
import { GetConversationUsecase } from "../../usecase/GetConversation.usecase";
import { ConversationsResultDto } from "../../core/dto/Chat/ConversationsResult.dto";
import { GetConversationsUsecase } from "../../usecase/GetConversations.usecase";

export class ChatController {
  constructor(
    private chatSseUsecase: ChatSseUsecase,
    private getConversationUsecase: GetConversationUsecase,
    private getConversationsUsecase: GetConversationsUsecase
  ) {}

  sse(req: Request, res: Response) {
    const username = (req as any).user.username;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    this.chatSseUsecase.addClient({ username: username, client: res });

    req.on("close", () => {
      this.chatSseUsecase.removeClient(username, res);
    });
  }

  async sendMessage(req: Request, res: Response) {
    const { recipient, content } = req.body;
    const sender = (req as any).user.username;
    let sendAt = new Date();

    const message: MessageDto = {
      sender: sender,
      recipient: recipient,
      sentAt: sendAt,
      content: content,
    };

    let result!: string | ErrorResponse;

    result = await this.chatSseUsecase.sendMessage({ message: message });

    res
      .status(typeof result === "string" ? 201 : result.statusCode)
      .send(typeof result === "string" ? { errors: result } : { data: result });
  }

  async getConversation(req: Request, res: Response) {
    const userName = (req as any).user.username;

    let result!: Conversation[] | ErrorResponse;

    result = await this.getConversationUsecase.execute({
      userName: userName,
    });
    res
      .status(result instanceof ErrorResponse ? result.statusCode : 201)
      .send(
        result instanceof ErrorResponse ? { errors: result } : { data: result }
      );
  }

  async getConversations(req: Request, res: Response) {
    const schema = Joi.object({
      conversationsId: objectId.objectId().required(),
      page: Joi.number().required(),
    });

    const { error, value } = schema.validate(req.body);

    let result!: ConversationsResultDto | ErrorResponse;

    if (error) {
      res.status(400).json({ message: error.details[0].message });
    } else {
      result = await this.getConversationsUsecase.execute({
        conversationsId: value.conversationsId,
        page: value.page,
      });
      res
        .status(result instanceof ErrorResponse ? result.statusCode : 200)
        .send(
          result instanceof ErrorResponse
            ? { errors: result }
            : { data: result }
        );
    }
  }
}
