import { app } from "../src/config/app";
import request from "supertest";

describe("Logout Resolver", () => {
  it("should log out the user", async () => {
    // Send a request to log out (assuming the user is authenticated)
    const response = await request(app)
      .post("/graphql")
      .send({
        query: `
          mutation {
            logout
          }
        `,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.logout).toBeDefined();
    // Add more assertions as needed
  });
});
