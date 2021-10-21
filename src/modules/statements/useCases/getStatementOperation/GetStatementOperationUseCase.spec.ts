import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


describe("Get Statement Operation Use Case", ()=> {

  const statementsRepository = new InMemoryStatementsRepository();
  const usersrepository = new InMemoryUsersRepository();

  const getStatementOperationUseCase = new GetStatementOperationUseCase(usersrepository, statementsRepository);

  let user: User;
  let statement: Statement;

  it("should be able to get statements with statement id", async () => {

    user = await usersrepository.create({
      email: "mail@mail.com",
      name: "any_name",
      password: "any_password"
    });

    statement = await statementsRepository.create({
      amount: 10,
      description: "deposit",
      type: OperationType.DEPOSIT,
      user_id: user.id as string
    });

    const result = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
    });

    expect(result).toEqual(statement);
  });

  it("Should not be able to get statements with invalid user", async () => {
    const result = getStatementOperationUseCase.execute({
      user_id: "any_user_id",
      statement_id: statement.id as string
    });

    await expect(result).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })
  
  it("Should not be able to get statements with invalid user", async () => {
    const result = getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: "any_statement_id"
    });

    await expect(result).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

});
