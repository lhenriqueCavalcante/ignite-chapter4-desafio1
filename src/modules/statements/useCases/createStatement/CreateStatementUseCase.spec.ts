import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError"
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { OperationType } from "../../entities/Statement"
import { User } from "../../../users/entities/User";

describe("Create Statement Use Case", () => {
    const usersRepository = new InMemoryUsersRepository()
    const statementsRepository = new InMemoryStatementsRepository();
    const createStatementUseCase = new CreateStatementUseCase(usersRepository,statementsRepository)

    let user: User;

  it("Should be able to create statement with deposit", async ()=> {
    user = await usersRepository.create({
      name: "any_user",
      email: "mail@mail.com",
      password: "any_password"
    });

    const statement : ICreateStatementDTO = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 10,
      description: "Deposit"
    } 
    const result = await createStatementUseCase.execute(statement);
    expect(result).toHaveProperty("id");
  });

  it("Should be able to create statement with withdraw", async ()=> {
    
    const statement : ICreateStatementDTO = {
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 5,
      description: "withdraw"
    } 
    const result = await createStatementUseCase.execute(statement);
    expect(result).toHaveProperty("id");
  });
  
  it("Should not be able to create statement with withdraw if account balance is insufficient", async ()=> {
    const testUser = await usersRepository.create({
      name: "any_user",
      email: "mail@mail.com",
      password: "any_password"
    });

    const statement : ICreateStatementDTO = {
      user_id: testUser.id as string,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: "withdraw"
    } 
    const result = createStatementUseCase.execute(statement);
    await expect(result).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);    
  });
  
  it("Should not be able to create statement with invalid user", async ()=> {
    
    const statement : ICreateStatementDTO = {
      user_id: "invalid_user_id",
      type: OperationType.WITHDRAW,
      amount: 5,
      description: "withdraw"
    } 
    const result = createStatementUseCase.execute(statement);
    await expect(result).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);    
  });

});
