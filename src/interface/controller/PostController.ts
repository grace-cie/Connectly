import Joi from "joi";
import objectId from "../../utils/ObjectId";
import { Request, Response } from "express";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";
import { CreatePostUsecase } from "../../usecase/CreatePosts.usecase";
import { GetMyPostsUsecase } from "../../usecase/GetMyPosts.usecase";
import { Either, isRight, unwrapEither } from "../../utils/Either";
import { PostsResultDto } from "../../core/dto/Posts/PostsResult.dto";

export class PostController {
  constructor(
    private createPostUsecase: CreatePostUsecase,
    private getMyPostsUsecase: GetMyPostsUsecase
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
      res.status(error.statusCode).send({ errors: result });
    }
  }

  async myPosts(req: Request, res: Response): Promise<void> {
    const schema = Joi.object({
      postedBy: Joi.string().required(),
      page: Joi.number().required(),
    });

    const { value, error } = schema.validate(req.params);

    let result: Either<ErrorResponse, PostsResultDto>;

    if (error) {
      res.status(400).json({ errors: { message: error.details[0].message } });
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
      res.status(error.statusCode).send({ errors: result });
    }
  }
}
