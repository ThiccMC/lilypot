import { Elysia, t } from "elysia";

import { PrismaClient } from "@prisma/client";
import path from "../utils/path";

const prisma = new PrismaClient(),
  pth = path(1);

const bound = t.String({
  default: "Error message",
  description: "It will likely go wrong, but nothing is exploitable ;)",
});

export default () => (app: Elysia) =>
  app
    .get(
      pth("/"),
      () => ({
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
    .get(
      pth("/badges"),
      async () =>
        await prisma.badge.findMany({
          select: {
            id: true,
            name: true,
            url: true,
          },
        }),
      {
        detail: {
          description: "Fetch a list of badges, result include id and name",
        },
        response: {
          200: t.Array(
            t.Object(
              {
                id: t.Number({
                  description: "The ID of badge we will use later",
                }),
                name: t.String({
                  description: "The short name of badge",
                }),
                url: t.String({
                  description: "The actual image used for badge",
                }),
              },
              { default: {} }
            )
          ),
        },
      }
    )
    // .get(pth("/badges/:id"), () => {})
    .get(
      pth("/badges/:id/owned"),
      async ({ params: { id } }) => {
        console.log(id);
        return await prisma.badge.findUnique({
          where: {
            id,
          },
          select: {
            _count: {
              select: {
                ownerships: {},
              },
            },
          },
        }) || "";
      },
      {
        params: t.Object({
          id: t.Numeric({
            default: 0,
            description:
              "Badge ID from list. Maybe you could find some hidden one?",
          }),
        }),
        response: {
          200: t.Object({
            _count: t.Object({
              ownerships: t.Number(),
            }),
          }),
          400: bound,
        },
      }
    );
