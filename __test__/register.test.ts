import { connect_db, drop_db } from "./db";
// import { gql } from "apollo-server-express";
import { app } from "../src/config/app";
import request from "supertest";

// beforeAll(async () => await connect_db());
// afterAll(async () => await drop_db());

describe("Homepage", () => {
  it('should return "Welcome to Eazipay Application" for the home query', async () => {
    const query = `
      query {
        home
      }
    `;

    const response = await request(app).post("/graphql").send({ query }).expect(200);

    const responseData = response.body.data;
    expect(responseData.home).toEqual("Welcome to Eazipay Application");
  });
});

// import { server } from "../src/config/app";
// it("Homepage", async () => {
//   let response = await server.executeOperation({
//     query: gql`
//       query {
//         home
//       }
//     `,
//   });
//   expect(response).toBeTruthy();
//   // expect(response.data?.home).toBeTruthy();
//   expect(typeof response.data?.home).toBe(String);
// });
