import { env } from "process";

class Environment {
  getPort(): number {
    const port = env.NODE_ENV === "test" ? env.TEST_PORT : env.PORT;
    return parseInt(port as string) || 8000;
  }

  getDbName(): string {
    const dbNameMap: { [key: string]: string } = {
      test: env.MONGODB_URL_TEST as string,
      development: env.MONGODB_URL_DEV as string,
    };

    const url =
      env.NODE_ENV === "test" || env.NODE_ENV === "development"
        ? `mongodb://127.0.0.1/${dbNameMap[env.NODE_ENV as string]}`
        : (env.MONGODB_URL as string);

    return url;
  }
}

export default new Environment();
