import { ObjectId } from "mongodb";

export class MessageDto {
  constructor(
    public _id: ObjectId,
    public sender: string,
    public recipient: string,
    public sentAt: Date,
    public content: string
  ) {}
}
