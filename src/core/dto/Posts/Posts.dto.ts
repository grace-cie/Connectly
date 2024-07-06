import { ObjectId } from "mongodb";
import { LikesDto } from "./Likes.dto";
import { CommentDto } from "./Comment.dto";

export class PostsDto {
  constructor(
    // required props
    public postedBy: ObjectId,
    public title: string,
    public body: string,
    // leave empty props
    public likes?: LikesDto[],
    public comments?: CommentDto[]
  ) {}
}
