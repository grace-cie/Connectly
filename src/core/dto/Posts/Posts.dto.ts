import { ObjectId } from "mongodb";
import { ReactionDto } from "./Reaction.dto";
import { CommentDto } from "./Comment.dto";

export class PostsDto {
  constructor(
    public _id: ObjectId,
    public postedBy: ObjectId,
    public title: string,
    public body: string,
    public createdAt: Date,
    public reactions?: ReactionDto[],
    public comments?: CommentDto[]
  ) {}
}
