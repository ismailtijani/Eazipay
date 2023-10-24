import { app } from "../src/config/app";
import request from "supertest";
import { drop_db } from "./0-db";

afterAll(() => {
  drop_db();
});
let confirmationCode = "";
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

describe("Login", () => {
  it("Login user successfully", async () => {
    const login = `
    mutation{
        login(logininputs:{email:"john.doe@example.com",password:"password123"}){
            user{
                _id
                firstName
                lastName
            }
        }
    }
    `;

    try {
      const response = await request(app).post("/graphql").send({ query: login }).expect(200);
      const data = response.body.data;
      // console.log(response.body.errors);
      // console.log(data);
      expect(data.user).toBeTruthy();
      // expect(response).toHaveProperty("data");
      // expect(response.body.errors).toBeFalsy();
      expect(data.user).toEqual({ _id: "1234", firstName: "John", lastName: "Doe" });
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
