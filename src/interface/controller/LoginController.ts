import { Request, Response } from "express";
import { LoginUserUsecase } from "../../usecase/LoginUser.usecase";
import { LoggedDataEntity } from "../../core/entity/LoggedData.entity";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";

export class LoginController {
  constructor(private usecase: LoginUserUsecase) {}

  async login(req: Request, res: Response): Promise<void> {
    const { userName, password } = req.body;

    let result!: LoggedDataEntity | ErrorResponse;
    result = await this.usecase.execute({
      userName: userName,
      password: password,
    });

    res
      .status(result instanceof ErrorResponse ? result.statusCode : 200)
      .send(
        result instanceof ErrorResponse ? { errors: result } : { data: result }
      );
  }
}
