import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


describe("Authenticate User Use Case", () => {

  const usersRepository = new InMemoryUsersRepository();
  const createUserUseCase = new CreateUserUseCase(usersRepository);
  const authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  let user: User;

  it("Should be able to authenticate user", async () => {
    user = await createUserUseCase.execute({
      email: "mail@mail.com",
      name: "any_name",
      password: "any_password"
    });


    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: "any_password"
    });

    expect(result).toHaveProperty("token");

  });
  
  it("Should not be able to authenticate with invalid email", async () => {
    const result = authenticateUserUseCase.execute({
      email: "invalid_email",
      password: "any_password"
    });

    await expect(result).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)

  });
  
  it("Should not be able to authenticate with invalid password", async () => {
    const result = authenticateUserUseCase.execute({
      email: user.email,
      password: "invalid_password"
    });

    await expect(result).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)

  });


});

