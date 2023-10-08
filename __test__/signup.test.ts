import { app } from "../src/config/app";
import request from "supertest";

describe("Signup", () => {
  it("Should sign up a new user", async () => {
    const signup = `
    mutation {
      signup(
        signupInputs: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          password: "password123",
          phoneNumber: "1234567890"
        }
      )
    }
    `;

    try {
      const response = await request(app).post("/graphql").send({ query: signup }).expect(200);

      const responseData = response.body.data;
      // Check if the signup was successful
      expect(responseData.signup).toEqual("Account created successfuly!");
    } catch (error) {
      throw error;
    }
  });
});
