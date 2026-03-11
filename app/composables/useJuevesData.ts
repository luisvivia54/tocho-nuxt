export type UiMatch = {
  id: string
  date: string
  time: string
  home: string
  away: string
  venue?: string
}

export type UiTeam = {
  id: string
  name: string
  category?: string
}

export function useJuevesData() {
  const leagueKey = "jueves" as const
  const season = 2026
  const stadiumBg = "/img/hero-stadium.jpg"

  function pick(obj: any, keys: string[]) {
    for (const k of keys) {
      const v = k.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj)
      if (v !== undefined && v !== null && v !== "") return v
    }
    return undefined
  }

  function toList(raw: any): any[] {
    if (Array.isArray(raw)) return raw
    if (raw && Array.isArray(raw.content)) return raw.content
    if (raw && Array.isArray(raw.items)) return raw.items
    if (raw && Array.isArray(raw.data)) return raw.data
    return []
  }

  function fmtDateMX(dt: any) {
    const d = dt ? new Date(dt) : new Date()
    const date = new Intl.DateTimeFormat("es-MX", {
      timeZone: "America/Mexico_City",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d).replace(".", "")
    const time = new Intl.DateTimeFormat("es-MX", {
      timeZone: "America/Mexico_City",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d)
    return { date, time }
  }

  function toUiMatch(g: any): UiMatch {
    const home =
      pick(g, ["homeTeam.name", "home_team.name", "homeName", "localTeam.name", "teamHome.name", "home_team"]) || "Local"
    const away =
      pick(g, ["awayTeam.name", "away_team.name", "awayName", "visitorTeam.name", "teamAway.name", "away_team"]) || "Visitante"
    const dt =
      pick(g, ["startTime", "dateTime", "kickoff", "gameDate", "date", "matchDateUtc", "match_date_utc", "match_date"]) ||
      new Date().toISOString()
    const venue = pick(g, ["venue", "field", "cancha", "location.name"])
    const { date, time } = fmtDateMX(dt)

    return {
      id: String(pick(g, ["id", "gameId", "game_id"]) ?? `${dt}-${home}-${away}`),
      date,
      time,
      home: String(home),
      away: String(away),
      venue: venue ? String(venue) : undefined,
    }
  }

  return {
    leagueKey,
    season,
    stadiumBg,
    pick,
    toList,
    toUiMatch,
  }
}