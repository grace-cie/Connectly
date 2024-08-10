import Joi from "joi";
import { Request, Response } from "express";
import { CreateUserUsecase } from "../../usecase/CreateUser.usecase";
import { GetUsersUsecase } from "../../usecase/GetUsers.usecase";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";
import { Either, isRight, unwrapEither } from "../../utils/Either";

export class UserController {
  constructor(
    private createUserUsecase: CreateUserUsecase,
    private getUsersUsecase: GetUsersUsecase
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
}
