import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "ThiccMC API Documentation",
          description:
            "Here you can find API spec for public API. Requirement: Must have a token.",
          version: "1.0.0",
        },
      },
    })
  )
  .get(
    "/",
    () =>
      new Response("/swagger", {
        status: 303,
      })
  )
  .get(
    "/api/v1",
    ({ body }) => ({
      msg: "Hello World!",
    }),
    {
      detail: {
        description: "Version 1 API test",
      },
      response: {
        200: t.Object({
          msg: t.String({
            default: "Hello World!",
          }),
        }),
      },
    }
  )
  .listen(3000);

console.log(`=> ${app.server?.hostname}:${app.server?.port}`);
