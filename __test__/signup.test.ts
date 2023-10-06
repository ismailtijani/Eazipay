import { app } from "../src/config/app";
import request from "supertest";

describe("Signup", () => {
  it('should "Create a new user account"', async () => {
    const signup = `
      query {
        home
      }
    `;

    const response = await request(app).post("/graphql").send({ signup }).expect(200);

    const responseData = response.body.data;
    expect(responseData.signup).toEqual("Account created successfuly!");
  });
});
