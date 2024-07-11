export class MessageDto {
  constructor(
    public sender: string,
    public recipient: string,
    public sentAt: Date,
    public content: string
  ) {}
}
