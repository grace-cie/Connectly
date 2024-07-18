import { MessageDto } from "./Message.dto";

export class Conversations {
  constructor(public conversationsList: MessageDto[]) {}
}
