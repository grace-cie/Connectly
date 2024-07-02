import Joi from "joi";
import { Request, Response } from "express";
import { CreateUserUsecase } from "../../application/usecase/CreateUser.usecase";
import { GetUsersUsecase } from "../../application/usecase/GetUsers.usecase";

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
      repeatPassword: Joi.string().min(8).max(30).required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
    } else {
      if (value.password == value.repeatPassword) {
        await this.createUserUsecase.execute({
          name: value.name,
          userName: value.userName,
          password: value.password,
        });
        res.status(201).send({ message: "User Created" });
      } else {
        res.status(401).send({ message: "Password's Doesn't Match" });
      }
    }
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    await this.getUsersUsecase.execute();
    console.log(await this.getUsersUsecase.execute());
    res.json({ data: await this.getUsersUsecase.execute() });
  }
}
