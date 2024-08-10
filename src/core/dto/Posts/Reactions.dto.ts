import { ObjectId } from "mongodb";
import { ReactionDto } from "./Reaction.dto";

export class ReactionsDto {
  constructor(public _id: ObjectId, public reactionsList: ReactionDto[]) {}
}
