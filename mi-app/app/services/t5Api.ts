export type LeagueKey = "domingo" | "jueves";

export type UiMatch = {
  id: string;
  league: LeagueKey;
  leagueLabel: string;
  date: string;
  time: string;
  home: string;
  away: string;
  venue?: string;
};

function fmtDateMX(dt: string | Date) {
  const d = typeof dt === "string" ? new Date(dt) : dt;
  const date = new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    day: "2-digit",
    month: "short",
  })
    .format(d)
    .replace(".", "");
  const time = new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
  return { date, time };
}

function pick(obj: any, keys: string[]) {
  for (const k of keys) {
    const v = k.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
}

// ✅ endpoint común: /api/games (ya lo has usado para DELETE)
// Aquí asumimos que existe GET /api/games con filtros
export async function getUpcomingMatches(params: {
  league: LeagueKey;
  limit?: number;
}) {
  const limit = params.limit ?? 8;

  // Si tu backend usa otro parámetro en lugar de "league", cámbialo aquí
  const list = await $fetch<any[]>(`/api/t5/games`, {
    query: {
      status: "SCHEDULED",
      league: params.league,
      limit,
      sort: "startTime,asc",
    },
  });

  return (list || []).map((g) => toUiMatch(g, params.league));
}

export function toUiMatch(game: any, leagueOverride: LeagueKey): UiMatch {
  const home =
    pick(game, ["homeTeam.name", "home_team.name", "homeName", "localTeam.name", "teamHome.name"]) ||
    "Local";
  const away =
    pick(game, ["awayTeam.name", "away_team.name", "awayName", "visitorTeam.name", "teamAway.name"]) ||
    "Visitante";

  const dt =
    pick(game, ["startTime", "dateTime", "kickoff", "gameDate", "date"]) ||
    new Date().toISOString();

  const { date, time } = fmtDateMX(dt);
  const venue = pick(game, ["venue", "field", "cancha", "location.name"]);

  return {
    id: String(pick(game, ["id", "gameId"]) ?? `${leagueOverride}-${dt}-${home}-${away}`),
    league: leagueOverride,
    leagueLabel: leagueOverride.toUpperCase(),
    date,
    time,
    home,
    away,
    venue,
  };
}