import { ObjectId } from "mongodb";
import { Either } from "../../utils/Either";
import { PostsResultDto } from "../dto/Posts/PostsResult.dto";
import { ErrorResponse } from "../entity/ErrorRespose.entity";
import { PostsData } from "../entity/PostsData.entity";
import { CommentDto } from "../dto/Posts/Comment.dto";
import { ReactionDto } from "../dto/Posts/Reaction.dto";

export interface PostsRepository {
  createPost(postData: PostsData): Promise<Either<ErrorResponse, string>>;
  deletePost(
    postId: ObjectId,
    deleteByUser: ObjectId
  ): Promise<Either<ErrorResponse, string>>;
  getMyPosts(
    postedBy: ObjectId,
    page: number
  ): Promise<Either<ErrorResponse, PostsResultDto>>;
  addComment(
    commentToPost: ObjectId,
    commentData: CommentDto
  ): Promise<Either<ErrorResponse, string>>;
  addReaction(
    reactToPost: ObjectId,
    reactionData: ReactionDto
  ): Promise<Either<ErrorResponse, string>>;
  getAllPosts(page: number): Promise<Either<ErrorResponse, PostsResultDto>>;
}
