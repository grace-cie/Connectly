import Joi from "joi";
import { Request, Response } from "express";
import { CreateUserUsecase } from "../../usecase/CreateUser.usecase";
import { GetUsersUsecase } from "../../usecase/GetUsers.usecase";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";
import { Either, isRight, unwrapEither } from "../../utils/Either";
import objectId from "../../utils/ObjectId";
import { GetUserUsecase } from "../../usecase/GetUser.usecase";
import { User } from "../../core/entity/User.entity";

export class UserController {
  constructor(
    private createUserUsecase: CreateUserUsecase,
    private getUsersUsecase: GetUsersUsecase,
    private getUserUsecase: GetUserUsecase
  ) {}

  async registerUser(req: Request, res: Response): Promise<void> {
    const schema = Joi.object({
      name: Joi.string().required(),
      userName: Joi.string().required(),
      password: Joi.string().min(8).max(30).required(),
      repeatPassword: Joi.any()
        .equal(Joi.ref("password"))
        .required()
        .label("Confirm password")
        .options({ messages: { "any.only": "{{#label}} does not match" } }),
      profilePicture: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);

    let result: Either<ErrorResponse, string>;
    if (error) {
      res.status(400).json({ errors: { message: error.details[0].message } });
      return;
    } else {
      result = await this.createUserUsecase.execute({
        name: value.name,
        userName: value.userName,
        password: value.password,
        profilePicture: value.profilePicture,
      });

      if (isRight(result)) {
        const data = unwrapEither(result);
        res.status(201).send({ data: { message: result } });
        return;
      }

      const error = unwrapEither(result);

      res.status(error.statusCode).send({ errors: error });
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    const result = await this.getUsersUsecase.execute();

    res.json({ data: { users: result } });
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const schema = Joi.object({
      user: objectId.objectId().required(),
    });

    const { value, error } = schema.validate(req.params);

    let result: Either<ErrorResponse, User>;

    if (error) {
      res.status(400).json({ errors: { message: error.details[0].message } });
      return;
    } else {
      result = await this.getUserUsecase.execute({
        user: value.user,
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
