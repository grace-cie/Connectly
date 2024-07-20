import { MessageDto } from "./Message.dto";

export class ConversationsResultDto {
  constructor(
    public currentPage: number,
    public maxPage: number,
    public conversationsList: MessageDto[]
  ) {}
}
