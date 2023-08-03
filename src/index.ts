import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import v1 from "./api/v1";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "ThiccMC API Documentation",
          description:
            "Here you can find API spec for public API. Requirement: Must have a token for POST/PUT/DELETE.",
          version: "1.0.0",
        },
      },
      path: "/api/vspec"
    })
  )
  .use(v1())
  .listen(8080);

console.log(`=> ${app.server?.hostname}:${app.server?.port}`);
