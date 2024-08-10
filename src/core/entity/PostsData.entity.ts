import { ObjectId } from "mongodb";

export class PostsData {
  constructor(
    public postedBy: ObjectId,
    public title: string,
    public body: string,
    public createdAt?: Date,
    public reactions?: ObjectId,
    public comments?: ObjectId,
    public id?: ObjectId
  ) {}
}
