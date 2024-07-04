import { Request, Response } from "express";
import { LoginUserUsecase } from "../../application/usecase/LoginUser.usecase";

export class LoginController {
  constructor(private usecase: LoginUserUsecase) {}

  async login(req: Request, res: Response): Promise<void> {
    const { userName, password } = req.body;
    const result = await this.usecase.execute({
      userName: userName,
      password: password,
    });

    res.status(result.statusCode).json({ data: result });
  }
}
