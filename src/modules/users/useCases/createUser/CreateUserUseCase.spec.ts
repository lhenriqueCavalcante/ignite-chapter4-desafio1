import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { UsersRepository } from "../../repositories/UsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


describe("Create User Use Case", () => {

  const usersRepository = new InMemoryUsersRepository();
  const createUserUseCase = new CreateUserUseCase(usersRepository);

  // let user: User;


  it("Should be able to create a new user", async () => {
    const result = await createUserUseCase.execute({
      email: "mail@mail.com",
      name: "any_name",
      password: "any_password"
    });

    expect(result).toHaveProperty("id");
  })
  
  it("Should not be able to create a new user with same email", async () => { 
    const result = createUserUseCase.execute({
      email: "mail@mail.com",
      name: "any_name",
      password: "any_password"
    });

    await expect(result).rejects.toBeInstanceOf(CreateUserError)
  });
  

});
