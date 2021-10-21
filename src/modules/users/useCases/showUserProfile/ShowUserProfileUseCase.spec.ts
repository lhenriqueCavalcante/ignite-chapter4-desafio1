import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("Show User Profile Use Case", () => {

  const usersrepository = new InMemoryUsersRepository();
  const showUserProfileUseCase = new ShowUserProfileUseCase(usersrepository);

  
  it("Should be able to show user profile", async () => {
    const user = await usersrepository.create({
      email: "mail@mail.com",
      name: "any_name",
      password: "any_password"
    });

    const result = await showUserProfileUseCase.execute(user.id as string)

    expect(result).toHaveProperty("id");
  });
  
  it("Should not be able to show user profile with invalid id", async () => {
    
    const result = showUserProfileUseCase.execute("invalid_id")

    await expect(result).rejects.toBeInstanceOf(ShowUserProfileError)
  });

});
