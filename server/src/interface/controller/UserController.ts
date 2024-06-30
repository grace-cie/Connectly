import { Request, Response } from 'express';
import { CreateUserUsecase } from '../../application/usecase/CreateUser.usecase';

export class UserController {
  constructor(private usecase: CreateUserUsecase) {}

  async create(req: Request, res: Response): Promise<void> {
    const { id, name } = req.body;
    await this.usecase.execute(id, name);
    res.status(201).send({ message: 'User created' });
  }
}
