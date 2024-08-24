import { ObjectId } from "mongodb";

export class PostsData {
  constructor(
    public postedBy: ObjectId,
    public postedByName: string,
    public title: string,
    public body: string,
    public reactionsCount: number,
    public commentsCount: number,
    public createdAt?: Date,
    public reactions?: ObjectId,
    public comments?: ObjectId,
    public id?: ObjectId
  ) {}
}
