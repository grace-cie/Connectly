import Joi from "joi";
import objectId from "../../utils/ObjectId";
import { Request, Response } from "express";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";
import { CreatePostUsecase } from "../../usecase/CreatePosts.usecase";
import { GetMyPostsUsecase } from "../../usecase/GetMyPosts.usecase";
import { Either, isRight, unwrapEither } from "../../utils/Either";
import { PostsResultDto } from "../../core/dto/Posts/PostsResult.dto";
import { DeletePostUsecase } from "../../usecase/DeletePosts.usecase";
import { AddCommentUsecase } from "../../usecase/AddComment.usecase";
import { AddReactionUsecase } from "../../usecase/AddReaction.usecase";
import { GetAllPostsUsecase } from "../../usecase/GetAllPosts.usecase";
import { DeleteCommentUsecase } from "../../usecase/DeleteComment.usecase";
import { EditCommentUsecase } from "../../usecase/EditComment.usecase";
import { EditPostUsecase } from "../../usecase/EditPost.usecase";

export class PostController {
  constructor(
    private createPostUsecase: CreatePostUsecase,
    private getMyPostsUsecase: GetMyPostsUsecase,
    private deletePostUsecase: DeletePostUsecase,
    private editPostUsecase: EditPostUsecase,
    private addCommentUsecase: AddCommentUsecase,
    private deleteCommentUsecase: DeleteCommentUsecase,
    private editCommentUsecase: EditCommentUsecase,
    private addReactionUsecase: AddReactionUsecase,
    private getAllPostsUsecase: GetAllPostsUsecase
  ) {}

  async createPost(req: Request, res: Response): Promise<void> {
    const schema = Joi.object({
      postedBy: objectId.objectId().required(),
      postedByName: Joi.string().min(1).max(30).required(),
      title: Joi.string().min(1).max(30).required(),
      body: Joi.string().min(1).max(100).required(),
    });

    const { error, value } = schema.validate(req.body);

    let result: Either<ErrorResponse, string>;
    if (error) {
      res.status(400).json({ errors: { message: error.details[0].message } });
    } else {
      result = await this.createPostUsecase.execute({
        postedBy: value.postedBy,
        postedByName: value.postedByName,
        title: value.title,
        body: value.body,
      });

      if (isRight(result)) {
        const data = unwrapEither(result);
        res.status(201).send({ data: data });
        return;
      }

      const error = unwrapEither(result);
      res.status(error.statusCode).send({ errors: error });
    }
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    const schema = Joi.object({
      postId: objectId.objectId().required(),
      user: objectId.objectId().required(),
    });

    const { value, error } = schema.validate(req.params);

    let result: Either<ErrorResponse, string>;

    if (error) {
      res.status(400).json({ errors: { message: error.details[0].message } });
      return;
    } else {
      result = await this.deletePostUsecase.execute({
        postId: value.postId,
        deleteByUser: value.user,
      });

      if (isRight(result)) {
        const data = unwrapEither(result);
        res.status(200).send({ data: data });
        return;
      }

      const error = unwrapEither(result);
      res.status(error.statusCode).send({ errors: error });
    }
  }

  async getAllPosts(req: Request, res: Response): Promise<void> {
    const schema = Joi.object({
      page: Joi.number().required(),
    });

    const { value, error } = schema.validate(req.params);

    let result: Either<ErrorResponse, PostsResultDto>;

    if (error) {
      res.status(400).json({ errors: { message: error.details[0].message } });
      return;
    } else {
      result = await this.getAllPostsUsecase.execute({
        page: value.page,
      });

      if (isRight(result)) {
        const data = unwrapEither(result);
        res.status(200).send({ data: data });
        return;
      }

      const error = unwrapEither(result);
      res.status(error.statusCode).send({ errors: error });
    }
  }

  async myPosts(req: Request, res: Response): Promise<void> {
    const schema = Joi.object({
      postedBy: objectId.objectId().required(),
      page: Joi.number().required(),
    });

    const { value, error } = schema.validate(req.params);

    let result: Either<ErrorResponse, PostsResultDto>;

    if (error) {
      res.status(400).json({ errors: { message: error.details[0].message } });
      return;
    } else {
      result = await this.getMyPostsUsecase.execute({
        postedBy: value.postedBy,
        page: value.page,
      });

      if (isRight(result)) {
        const data = unwrapEither(result);
        res.status(200).send({ data: data });
        return;
      }

      const error = unwrapEither(result);
      res.status(error.statusCode).send({ errors: error });
    }
  }

  async editPost(req: Request, res: Response): Promise<void> {
    // Schema for validating params
    const paramsSchema = Joi.object({
      postId: objectId.objectId().required(),
      editByUser: objectId.objectId().required(),
    });

    // Schema for validating body
    const bodySchema = Joi.object({
      title: Joi.string().min(1).max(30).required(),
      body: Joi.string().min(1).max(100).required(),
    });

    const { value: paramsVal, error: paramsErr } = paramsSchema.validate(
      req.params
    );
    const { value: bodyVal, error: bodyErr } = bodySchema.validate(req.body);

    const error = paramsErr || bodyErr;
    let result: Either<ErrorResponse, string>;

    if (error) {
      res.status(400).json({ errors: { message: error.details[0].message } });
      return;
    } else {
      result = await this.editPostUsecase.execute({
        postId: paramsVal.postId,
        editByUser: paramsVal.editByUser,
        title: bodyVal.title,
        body: bodyVal.body,
      });

      if (isRight(result)) {
        const data = unwrapEither(result);
        res.status(200).send({ data: data });
        return;
      }

      const error = unwrapEither(result);
      res.status(error.statusCode).send({ errors: error });
    }
  }

  async deleteComment(req: Request, res: Response): Promise<void> {
    const schema = Joi.object({
      commentId: objectId.objectId().required(),
      commentIdOnList: objectId.objectId().required(),
      deleteByUser: objectId.objectId().required(),
    });

    const { value, error } = schema.validate(req.params);
    let result: Either<ErrorResponse, string>;

    if (error) {
      res.status(400).json({ errors: { message: error.details[0].message } });
      return;
    } else {
      result = await this.deleteCommentUsecase.execute({
        commentId: value.commentId,
        commentIdOnList: value.commentIdOnList,
        deleteByUser: value.deleteByUser,
      });

      if (isRight(result)) {
        const data = unwrapEither(result);
        res.status(200).send({ data: data });
        return;
      }

      const error = unwrapEither(result);
      res.status(error.statusCode).send({ errors: error });
    }
  }

  async editComment(req: Request, res: Response): Promise<void> {
    // Schema for validating params
    const paramsSchema = Joi.object({
      commentId: objectId.objectId().required(),
      editByUser: objectId.objectId().required(),
    });

    // Schema for validating body
    const bodySchema = Joi.object({
      commentOnListId: objectId.objectId().required(),
      commentBy: objectId.objectId().required(),
      name: Joi.string().required(),
      comment: Joi.string().required(),
    });

    const { value: paramsVal, error: paramsErr } = paramsSchema.validate(
      req.params
    );
    const { value: bodyVal, error: bodyErr } = bodySchema.validate(req.body);

    const error = paramsErr || bodyErr;
    let result: Either<ErrorResponse, string>;

    if (error) {
      res.status(400).json({ errors: { message: error.details[0].message } });
      return;
    } else {
      result = await this.editCommentUsecase.execute({
        commentId: paramsVal.commentId,
        editByUser: paramsVal.editByUser,
        commentOnListId: bodyVal.commentOnListId,
        commentBy: bodyVal.commentBy,
        name: bodyVal.name,
        comment: bodyVal.comment,
      });

      if (isRight(result)) {
        const data = unwrapEither(result);
        res.status(200).send({ data: data });
        return;
      }

      const error = unwrapEither(result);
      res.status(error.statusCode).send({ errors: error });
    }
  }

  async addComment(req: Request, res: Response): Promise<void> {
    const schema = Joi.object({
      commentToPost: objectId.objectId().required(),
      commentBy: objectId.objectId().required(),
      name: Joi.string().required(),
      comment: Joi.string().required(),
    });

    const { value, error } = schema.validate(req.body);
    let result: Either<ErrorResponse, string>;

    if (error) {
      res.status(400).json({ errors: { message: error.details[0].message } });
      return;
    } else {
      result = await this.addCommentUsecase.execute({
        commentToPost: value.commentToPost,
        commentBy: value.commentBy,
        name: value.name,
        comment: value.comment,
      });

      if (isRight(result)) {
        const data = unwrapEither(result);
        res.status(200).send({ data: data });
        return;
      }

      const error = unwrapEither(result);
      res.status(error.statusCode).send({ errors: error });
    }
  }

  async addReaction(req: Request, res: Response): Promise<void> {
    const schema = Joi.object({
      reactToPost: objectId.objectId().required(),
      reactedBy: objectId.objectId().required(),
      name: Joi.string().required(),
      reactionType: Joi.string().required(),
    });

    const { value, error } = schema.validate(req.body);
    let result: Either<ErrorResponse, string>;

    if (error) {
      res.status(400).json({ errors: { message: error.details[0].message } });
      return;
    } else {
      result = await this.addReactionUsecase.execute({
        reactToPost: value.reactToPost,
        reactedBy: value.reactedBy,
        name: value.name,
        reactionType: value.reactionType,
      });

      if (isRight(result)) {
        const data = unwrapEither(result);
        res.status(200).send({ data: data });
        return;
      }

      const error = unwrapEither(result);
      res.status(error.statusCode).send({ errors: error });
    }
  }
}
