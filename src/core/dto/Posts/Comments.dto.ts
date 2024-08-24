import { ObjectId } from "mongodb";
import { CommentDto } from "./Comment.dto";

export class CommentsDto {
  constructor(public _id: ObjectId, public commentsList: CommentDto[]) {}
}
