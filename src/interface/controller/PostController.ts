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

export class PostController {
  constructor(
    private createPostUsecase: CreatePostUsecase,
    private getMyPostsUsecase: GetMyPostsUsecase,
    private deletePostUsecase: DeletePostUsecase,
    private addCommentUsecase: AddCommentUsecase,
    private addReactionUsecase: AddReactionUsecase,
    private getAllPostsUsecase: GetAllPostsUsecase
  ) {}

  async createPost(req: Request, res: Response): Promise<void> {
    const schema = Joi.object({
      postedBy: objectId.objectId().required(),
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
