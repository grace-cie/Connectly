import { ObjectId } from "mongodb";

export class LikesDto {
  constructor(public likedBy: ObjectId) {}
}
