import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceUseCase } from "./GetBalanceUseCase"
import { GetBalanceError } from "./GetBalanceError";


describe("Get Balance Use Case", () => {

  const statementsRepository = new InMemoryStatementsRepository();
  const usersRepository = new InMemoryUsersRepository();

  const createStatementUseCase = new CreateStatementUseCase(usersRepository,statementsRepository)
  const getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)

  let user : User;

  it("Should be able to get a balance", async () => {
    user = await usersRepository.create({
      name: "any_name",
      email: "mail@mail.com",
      password: "any_password"
    });

    const deposit : ICreateStatementDTO = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 10,
      description: "Deposit"
    } 
    
    const withdraw : ICreateStatementDTO = {
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 5,
      description: "Withdraw"
    } 

    await createStatementUseCase.execute(deposit);
    await createStatementUseCase.execute(withdraw);

    const result = await getBalanceUseCase.execute({ user_id: user.id as string});

    expect(result).toHaveProperty("balance");
    expect(result).toHaveProperty("statement");
    expect(result.statement).toHaveLength(2);
    expect(result.balance).toBe(5);
  })
  
  it("Should not be able to get a balance with invalid user", async () => {
     const statement : ICreateStatementDTO = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 10,
      description: "Deposit"
    } 
    await createStatementUseCase.execute(statement);
    
    await createStatementUseCase.execute(statement);

    const result = getBalanceUseCase.execute({ user_id: "invalid_user" });

    await expect(result).rejects.toBeInstanceOf(GetBalanceError)
  })

})