import Joi from "joi";
import objectId from "../../utils/ObjectId";
import { Request, Response } from "express";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";
import { CreatePostUsecase } from "../../usecase/CreatePosts.usecase";
import { GetMyPostsUsecase } from "../../usecase/GetMyPosts.usecase";

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

    let result!: string | ErrorResponse;
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    } else {
      result = await this.createPostUsecase.execute({
        postedBy: value.postedBy,
        title: value.title,
        body: value.body,
      });
      res
        .status(result instanceof ErrorResponse ? result.statusCode : 201)
        .send({ message: result });
    }
  }

  async myPosts(req: Request, res: Response): Promise<void> {
    const schema = Joi.object({
      postedBy: Joi.string().required(),
      page: Joi.number().required(),
    });

    const { value, error } = schema.validate(req.params);

    if (error) {
      res.status(400).json({ message: error.details[0].message });
    } else {
      const result = await this.getMyPostsUsecase.execute({
        postedBy: value.postedBy,
        page: value.page,
      });
      res.json({ data: result });
    }
  }
}
