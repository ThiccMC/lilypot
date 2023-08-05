import { mySQL } from "../../func/db";
import { dirtyUnsignedInterger } from "../../utils/engine";

const allowedDatabases = ["ban", "warn", "mute"] as const;

export type PunishmentDatabase = (typeof allowedDatabases)[number];

// Example paginated query
//
// SELECT
//     r.name,
//     t.banned_by_name,
//     t.reason,
//     t.ipban,
//     t.time,
//     t.until,
//     t.removed_by_name,
//     t.removed_by_reason,
//     t.active
// FROM
//     litebans_mutes AS t
// INNER JOIN litebans_history AS r
// ON
//     t.uuid = r.uuid
// WHERE
//     t.silent = 0
// ORDER BY
//     t.time
// LIMIT 10 OFFSET 1;

export async function qpag(tq: PunishmentDatabase, pg: number, pp = 12) {
  if (
    !allowedDatabases.includes(tq) ||
    dirtyUnsignedInterger(pg) ||
    dirtyUnsignedInterger(pp) ||
    pp > 12
  )
    return {
      msg: "Dirty data (we know)",
    };

  const q = await mySQL({
    // injection proof alr
    q: `SELECT COUNT(id) AS c FROM litebans_${tq}s WHERE silent = 0`,
    v: [],
  });

  const bound = (q[0].c as number | undefined) || -1,
    ffset = pg * pp;

  if (ffset > bound)
    return {
      bound,
      msg: "Pagination out of bound (this likely won't happen on our fault, as we won't delete entries)",
    };

  return {
    bound,
    data: await mySQL({
      q: `SELECT r.name, t.id, t.banned_by_name AS moderator, t.reason, t.server_origin AS server, t.ipban, t.time, t.until, t.removed_by_name, t.removed_by_reason, t.active FROM litebans_${tq}s AS t INNER JOIN litebans_history AS r ON t.uuid = r.uuid WHERE t.silent = 0 ORDER BY t.time DESC LIMIT ? OFFSET ?`,
      v: [pp, ffset],
    }),
  };
}

export async function qind(tq: PunishmentDatabase, id: number) {
  if (!allowedDatabases.includes(tq) || dirtyUnsignedInterger(id))
    return {
      msg: "Dirty data (we know)",
    };
  return {
    data: await mySQL({
      q: `SELECT t.id, r.name, t.reason, t.banned_by_name, t.removed_by_name, t.removed_by_reason, t.removed_by_date, t.time, t.until, t.ipban, t.ipban_wildcard, t.active, t.server_scope, t.server_origin FROM litebans_${tq}s AS t INNER JOIN litebans_history AS r ON t.uuid = r.uuid WHERE t.id = ? AND t.silent = 0;`,
      v: [id],
    }),
  };
}
