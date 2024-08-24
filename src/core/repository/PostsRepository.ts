import { ObjectId } from "mongodb";
import { Either } from "../../utils/Either";
import { PostsResultDto } from "../dto/Posts/PostsResult.dto";
import { ErrorResponse } from "../entity/ErrorRespose.entity";
import { PostsData } from "../entity/PostsData.entity";
import { CommentDto } from "../dto/Posts/Comment.dto";
import { ReactionDto } from "../dto/Posts/Reaction.dto";
import { PostsDto } from "../dto/Posts/Posts.dto";

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
  getAllPosts(page: number): Promise<Either<ErrorResponse, PostsResultDto>>;
  editPost(
    postId: ObjectId,
    editByUser: ObjectId,
    postData: PostsDto
  ): Promise<Either<ErrorResponse, string>>;
  addComment(
    commentToPost: ObjectId,
    commentData: CommentDto
  ): Promise<Either<ErrorResponse, string>>;
  deleteComment(
    commentId: ObjectId,
    commentIdOnList: ObjectId,
    deleteByUser: ObjectId
  ): Promise<Either<ErrorResponse, string>>;
  editComment(
    commentId: ObjectId,
    editByUser: ObjectId,
    updatedCommentData: CommentDto
  ): Promise<Either<ErrorResponse, string>>;
  addReaction(
    reactToPost: ObjectId,
    reactionData: ReactionDto
  ): Promise<Either<ErrorResponse, string>>;
}
