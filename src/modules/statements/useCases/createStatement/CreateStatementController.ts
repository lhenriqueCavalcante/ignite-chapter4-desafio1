import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { receivedId } = request.params;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split('/')
    const type = receivedId? OperationType.TRANSFER : splittedPath[splittedPath.length - 1] as OperationType;

    console.log(type);
    

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      user_id,
      received_id: receivedId,
      type,
      amount,
      description
    });

    return response.status(201).json(statement);
  }
}
