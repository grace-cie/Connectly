import { Request, Response } from 'express';
import { CreateUserUsecase } from '../../application/usecase/CreateUser.usecase';
import { GetUsersUsecase } from '../../application/usecase/GetUsers.usecase';


export class UserController {
  constructor(private createUserUsecase: CreateUserUsecase, private getUsersUsecase: GetUsersUsecase) {}

  async create(req: Request, res: Response): Promise<void> {
    const { id, name, userName } = req.body;
    await this.createUserUsecase.execute(id, name, userName);
    res.status(201).send({ message: 'User created' });
  }

  async getUsers(req: Request, res: Response): Promise<void> {
   
    await this.getUsersUsecase.execute();
    console.log( await this.getUsersUsecase.execute())
    res.json({data: await this.getUsersUsecase.execute(),});
  }
}
