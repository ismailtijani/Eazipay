import { env } from "process";

class Environment {
  public mongoUrl: string;
  public PORT: number;
  getPort() {
    if (env.NODE_ENV === "test") {
      this.PORT = parseInt(env.TEST_PORT as string);
    } else if (env.NODE_ENV === "production") {
      this.PORT = parseInt(env.PORT as string);
    } else this.PORT = 8000;
  }

  getDbName() {
    if (env.NODE_ENV === "test") {
      this.mongoUrl = `mongodb://127.0.0.1/${env.MONGODB_URL_TEST as string}`;
    } else if (env.NODE_ENV === "production") {
      this.mongoUrl = env.MONGODB_URL as string;
    } else this.mongoUrl = `mongodb://127.0.0.1/eazipayDev`;
  }
}
export const { PORT, mongoUrl } = new Environment();
