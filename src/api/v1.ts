import { Elysia, t } from "elysia";

import { PunishmentDatabase, qind, qpag } from "./lib/pun";
import env from "../utils/env";
import { prisma } from "../func/db";

const bound = t.String({
    default: "Error message",
    description: "It will likely go wrong, but nothing is exploitable ;)",
  }),
  punprm = t.Enum({
    ban: "ban",
    mute: "mute",
    warning: "warning",
  });

export default () => (app: Elysia) =>
  app.group("/v1", (app) =>
    app
      .get(
        "/",
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
        "/badges",
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
      // .get(("/badges/:id"), () => {})
      .get(
        "/badges/:id/owned",
        async ({ params: { id } }) => {
          console.log(id);
          return (
            (await prisma.badge.findUnique({
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
            })) || ""
          );
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
      )
      // TODO: Add type declarations
      .get(
        "/punishments/:table/:page",
        ({ params: { table, page } }) =>
          qpag(table as PunishmentDatabase, page, env.punishment.batch),
        {
          detail: {
            description: `Query punishments in batch. Fixed at ${env.punishment.batch} entry per page (configured on the fly).`,
          },
          params: t.Object({
            table: punprm,
            page: t.Numeric(),
          }),
        }
      )
      .get(
        "/punishment/:table/:id",
        ({ params: { table, id } }) => qind(table as PunishmentDatabase, id),
        {
          detail: {
            description:
              "Request a detail of a punishment rather than a TLDR list",
          },
          params: t.Object({
            table: punprm,
            id: t.Numeric(),
          }),
        }
      )
  );
