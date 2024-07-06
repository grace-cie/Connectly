import { ObjectId } from "mongodb";

export class CommentDto {
  constructor(public commentBy: ObjectId, public comment: string) {}
}
