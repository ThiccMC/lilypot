import { ConnectionOptions } from "mysql2";

const env = (k: string, de?: string) =>
  process.env[k] || de || k + " IS A REQUIRED ENVIROMENT VARIABLE";

export default {
  mysql: {
    uri: env("RO_DATABASE_URL"),
    compress: true,
    insecureAuth: true,
    supportBigNumbers: true
  } as ConnectionOptions,
  punishment: {
    batch: parseInt(env("PUNISHMENT_PAGINATION_SIZE", "10"))
  }
};
