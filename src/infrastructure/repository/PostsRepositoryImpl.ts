import { Collection, ObjectId, WithId } from "mongodb";
import { PostsResultDto } from "../../core/dto/Posts/PostsResult.dto";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";
import { PostsData } from "../../core/entity/PostsData.entity";
import { PostsRepository } from "../../core/repository/PostsRepository";
import { getDatabase } from "../../middleware/MongoDB";
import { Either, makeLeft, makeRight } from "../../utils/Either";
import { CommentDto } from "../../core/dto/Posts/Comment.dto";
import { ReactionDto } from "../../core/dto/Posts/Reaction.dto";
import { ReactionsDto } from "../../core/dto/Posts/Reactions.dto";

export class PostsRepositoryImpl implements PostsRepository {
  private db = getDatabase();
  private postsCollection = this.db.collection("Posts");
  private commentsCollection = this.db.collection("Comments");
  private userCollection = this.db.collection("Users");

  async createPost(
    postData: PostsData
  ): Promise<Either<ErrorResponse, string>> {
    const reactionCollection = this.db.collection("Reactions");
    try {
      const likesResult = await reactionCollection.insertOne({
        reactionsList: [],
      });

      const commentsResult = await this.commentsCollection.insertOne({
        commentsList: [],
      });

      const post: PostsData = {
        postedBy: new ObjectId(postData.postedBy),
        title: postData.title,
        body: postData.body,
        createdAt: new Date(),
        reactions: likesResult.insertedId,
        comments: commentsResult.insertedId,
      };

      await this.postsCollection.insertOne(post);

      return makeRight("created");
    } catch (e) {
      const errorResponse: ErrorResponse = {
        statusCode: 400,
        errorMessage: e?.toString() ?? "",
      };
      return makeLeft(errorResponse);
    }
  }

  async deletePost(
    postId: ObjectId,
    deleteByUser: ObjectId
  ): Promise<Either<ErrorResponse, string>> {
    const reactionCollection = this.db.collection("Reactions");
    const collection: Collection<PostsData> = this.db.collection("Posts");
    try {
      const postData = await collection.findOneAndDelete({
        _id: new ObjectId(postId),
      });

      const validUserToDelete = deleteByUser == postData?.postedBy;

      if (!validUserToDelete) {
        const errorResponse: ErrorResponse = {
          statusCode: 401,
          errorMessage: "Not Authorized",
        };
        return makeLeft(errorResponse);
      }

      await reactionCollection.findOneAndDelete({
        _id: new ObjectId(postData.reactions),
      });

      await this.commentsCollection.findOneAndDelete({
        _id: new ObjectId(postData.comments),
      });

      return makeRight("deleted");
    } catch (e) {
      const errorResponse: ErrorResponse = {
        statusCode: 400,
        errorMessage: e?.toString() ?? "",
      };
      return makeLeft(errorResponse);
    }
  }

  async getMyPosts(
    postedBy: ObjectId,
    page: number,
    pageSize: number = 10 // Default page size
  ): Promise<Either<ErrorResponse, PostsResultDto>> {
    let postsResult!: PostsResultDto;
    let errorResponse!: ErrorResponse;

    try {
      // Calculate the total number of documents matching the criteria
      const post = await this.postsCollection
        .find({
          postedBy: new ObjectId(postedBy),
        })
        .toArray();

      if (!post) {
        errorResponse = {
          statusCode: 404,
          errorMessage: "Post Record Not Found!",
        };
        return makeLeft(errorResponse);
      }

      // Calculate the total number of items and the maximum number of pages
      const totalItems = post.length;
      const maxPage = Math.ceil(totalItems / pageSize);

      // If the requested page number exceeds the maximum pages, return an error response
      if (page > maxPage) {
        errorResponse = {
          statusCode: 404,
          errorMessage: "Page number exceeds maximum pages",
        };
        return makeLeft(errorResponse);
      }

      // Calculate the number of documents to skip for the current page
      const skip = (page - 1) * pageSize;

      // Slice the postsList to get only the items for the current page
      const pagedPostList = post
        .slice(skip, skip + pageSize)
        .map(
          (postData: any) =>
            new PostsData(
              postData.postedBy,
              postData.title,
              postData.body,
              new Date(postData.createdAt),
              postData.likes,
              postData.comments,
              postData._id
            )
        );

      // Create the result object with the current page, maxPage, and paged posts list
      postsResult = {
        currentPage: page,
        maxPage: maxPage,
        postsList: pagedPostList,
      };

      // Return the result object
      return makeRight(postsResult);
    } catch (e) {
      // In case of any error, create and return an error response with status code 500
      errorResponse = {
        statusCode: 500,
        errorMessage: `An error occurred while retrieving posts: ${e}`,
      };
      return makeLeft(errorResponse);
    }
  }

  async addComment(
    commentToPost: ObjectId,
    commentData: CommentDto
  ): Promise<Either<ErrorResponse, string>> {
    const collection: Collection<CommentDto> = this.db.collection("Comments");
    const postcollection: Collection<PostsData> = this.db.collection("Posts");
    let errorResponse: ErrorResponse;
    try {
      const isValidUser = await this.userCollection.findOne({
        _id: new ObjectId(commentData.commentBy),
      });
      if (!isValidUser) {
        errorResponse = {
          statusCode: 403,
          errorMessage: "Not a valid user",
        };
        return makeLeft(errorResponse);
      }
      const post = await postcollection.findOne({
        _id: new ObjectId(commentToPost),
      });

      const commentListId = post?.comments;

      await collection.updateOne(
        { _id: new ObjectId(commentListId) },
        { $push: { commentsList: commentData } }
      );

      return makeRight("Comment Posted");
    } catch (e) {
      errorResponse = {
        statusCode: 500,
        errorMessage: `Failed to make a comment : ${e}`,
      };
      return makeLeft(errorResponse);
    }
  }

  async addReaction(
    reactToPost: ObjectId,
    reactionData: ReactionDto
  ): Promise<Either<ErrorResponse, string>> {
    const reactionCollection: Collection<ReactionsDto> =
      this.db.collection("Reactions");
    const postCollection: Collection<PostsData> = this.db.collection("Posts");
    let errorResponse: ErrorResponse;

    try {
      // Check if the user is valid
      const isValidUser = await this.userCollection.findOne({
        _id: new ObjectId(reactionData.reactedBy),
      });
      if (!isValidUser) {
        errorResponse = {
          statusCode: 403,
          errorMessage: "Not a valid user",
        };
        return makeLeft(errorResponse);
      }

      // Find the post
      const post = await postCollection.findOne({
        _id: new ObjectId(reactToPost),
      });
      if (!post) {
        errorResponse = {
          statusCode: 404,
          errorMessage: "Post not found",
        };
        return makeLeft(errorResponse);
      }

      // Find the reactions document associated with the post
      const reactionDoc = await reactionCollection.findOne({
        _id: new ObjectId(post.reactions),
      });

      if (!reactionDoc) {
        // No reaction document exists, create a new one with the new reaction
        await reactionCollection.updateOne(
          { _id: new ObjectId(post.reactions) },
          { $push: { reactionsList: reactionData } }
        );
      } else {
        // Check if the user has already reacted
        const existingReactionIndex = reactionDoc.reactionsList.findIndex(
          (reaction) => reaction.reactedBy.equals(reactionData.reactedBy)
        );

        if (existingReactionIndex > -1) {
          // Update the existing reaction
          reactionDoc.reactionsList[existingReactionIndex].reactionType =
            reactionData.reactionType;
          reactionDoc.reactionsList[existingReactionIndex].reactOn = new Date();
        } else {
          // Add a new reaction
          reactionDoc.reactionsList.push(reactionData);
        }

        // Update the reactions document
        await reactionCollection.updateOne(
          { _id: new ObjectId(post.reactions) },
          { $set: { reactionsList: reactionDoc.reactionsList } }
        );
      }

      return makeRight("Reacted");
    } catch (e) {
      errorResponse = {
        statusCode: 500,
        errorMessage: `Failed to add a reaction : ${e}`,
      };
      return makeLeft(errorResponse);
    }
  }
}
