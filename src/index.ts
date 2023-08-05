import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import v1 from "./api/v1";
import makeMetrics, { Metric } from "./utils/prometheus";
import env from "./utils/env";

const swag = (v: string) =>
  swagger({
    documentation: {
      info: {
        title: "ThiccMC API Documentation",
        description:
          "Here you can find API spec for public API. Requirement: Must have a token for POST/PUT/DELETE.",
        version: v,
      },
      security: [
        {
          name: ["huh"],
        },
      ],
    },
    version: "5.3.1",
    path: "/specs",
    excludeStaticFile: false,
  });

const app = new Elysia()
  .use(swag("1.0.0"))
  .group("/api", (app) => app.use(v1()));

app
  .get(
    "/metrics",
    () =>
      new Response(
        makeMetrics(
          (
            [
              {
                name: "api_http_pending",
                value: app.server?.pendingRequests || 0,
              },
              {
                name: "api_ws_pending",
                value: app.server?.pendingWebSockets || 0,
              },
            ] as Metric[]
          ).map((met) => {
            met.labels = {
              ...met.labels,
              host: env.runtime.hostname,
            };
            return met;
          })
        )
      )
  )
  .listen(8080);

console.log(`=> ${app.server?.hostname}:${app.server?.port}`);
Bun.gc(true);

export type App = typeof app;
