import { MessageDto } from "./Message.dto";

export class Conversation {
  constructor(
    public sender: string,
    public recipient: string,
    public conversationList: MessageDto[]
  ) {}
}
