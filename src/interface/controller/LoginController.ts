import { Request, Response } from "express";
import { LoginUserUsecase } from "../../application/usecase/LoginUser.usecase";

export class LoginController {
  constructor(private usecase: LoginUserUsecase) {}

  async create(req: Request, res: Response): Promise<void> {
    const { id, name } = req.body;
    await this.usecase.execute(id, name);
    res.status(201).send({ message: "Logged" });
  }
}
