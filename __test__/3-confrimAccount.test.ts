import { app } from "../src/config/app";
import request from "supertest";

describe("Confirm Account Resolver", () => {
  it("should confirm the user account", async () => {
    // Send a request to confirm the account with a valid confirmation code
    const response = await request(app)
      .post("/graphql")
      .send({
        query: `
          mutation {
            confirmAccount(confirmationCode: "validConfirmationCode")
          }
        `,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.confirmAccount).toBeDefined();
    // Add more assertions as needed
  });
});
