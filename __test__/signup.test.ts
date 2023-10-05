import { app } from "../src/config/app";
import request from "supertest";

// describe("Homepage", () => {
//   it('should return "Welcome to Eazipay Application" for the home query', async () => {
//     const query = `
//       query {
//         home
//       }
//     `;

//     const response = await request(app).post("/graphql").send({ query }).expect(200);

//     const responseData = response.body.data;
//     expect(responseData.home).toEqual("Welcome to Eazipay Application");
//   });
// });
