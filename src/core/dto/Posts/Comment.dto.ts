import { ObjectId } from "mongodb";

export class CommentDto {
  constructor(
    public _id: ObjectId,
    public commentBy: ObjectId,
    public name: String,
    public comment: string,
    public commentOn?: Date
  ) {}
}
