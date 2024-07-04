import Joi from "joi";
import { Request, Response } from "express";
import { CreateUserUsecase } from "../../application/usecase/CreateUser.usecase";
import { GetUsersUsecase } from "../../application/usecase/GetUsers.usecase";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";

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
    });

    const { error, value } = schema.validate(req.body);

    let result!: string | ErrorResponse;
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    } else {
      result = await this.createUserUsecase.execute({
        name: value.name,
        userName: value.userName,
        password: value.password,
      });
      res
        .status(result instanceof ErrorResponse ? result.statusCode : 201)
        .send({ message: result });
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    const result = await this.getUsersUsecase.execute();

    res.json({ data: { users: result } });
  }
}
