import { ObjectId } from "mongodb";

export class ReactionDto {
  constructor(
    public _id: ObjectId,
    public reactedBy: ObjectId,
    public name: string,
    public reactionType: string,
    public reactOn: Date
  ) {}
}
