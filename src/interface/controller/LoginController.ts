import { Request, Response } from "express";
import { LoginUserUsecase } from "../../usecase/LoginUser.usecase";
import { LoggedDataEntity } from "../../core/entity/LoggedData.entity";
import { ErrorResponse } from "../../core/entity/ErrorRespose.entity";
import { Either, isRight, unwrapEither } from "../../utils/Either";

export class LoginController {
  constructor(private usecase: LoginUserUsecase) {}

  async login(req: Request, res: Response): Promise<void> {
    const { userName, password } = req.body;

    let result: Either<ErrorResponse, LoggedDataEntity>;
    result = await this.usecase.execute({
      userName: userName,
      password: password,
    });

    if (isRight(result)) {
      const data = unwrapEither(result);
      res.status(200).send({ data: data });
      return;
    }

    const error = unwrapEither(result);
    res.status(error.statusCode).send({ errors: error });
    return;
  }
}
