import request from "supertest";
import { app } from "../src/config/app";

describe("Forget Password Resolver", () => {
  it("should initiate the password reset process", async () => {
    // Send a request to initiate the password reset with a valid email
    const response = await request(app)
      .post("/graphql")
      .send({
        query: `
          mutation {
            forgetPassword(email: "johndoe@example.com")
          }
        `,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.forgetPassword).toBeDefined();
    // Add more assertions as needed
  });
});
