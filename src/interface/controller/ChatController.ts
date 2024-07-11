import { Request, Response } from "express";
import { ChatSseUsecase } from "../../usecase/ChatSse.usecase";
import { MessageDto } from "../../core/dto/Chat/Message.dto";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";

export class ChatController {
  private chatSseUsecase: ChatSseUsecase;

  constructor(chatSseUsecase: ChatSseUsecase) {
    this.chatSseUsecase = chatSseUsecase;
  }

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
      .send({ message: result });
  }
}
