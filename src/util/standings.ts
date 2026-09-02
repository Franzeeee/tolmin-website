// Shared types for the manually-entered current-season league standings
// (src/app/admin/clansko-lestvica, /api/lestvica-tabela) as consumed by
// the public /clansko-mostvo/lestvica page.

export type StandingsRow = {
  _id: string;
  league: string;
  team: string;
  teamLogo?: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

export function goalsDiff(row: Pick<StandingsRow, 'goalsFor' | 'goalsAgainst'>): number {
  return row.goalsFor - row.goalsAgainst;
}

// Standard football tiebreak order: points, then goal difference, then goals scored.
export function sortStandings(rows: StandingsRow[]): StandingsRow[] {
  return [...rows].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const diff = goalsDiff(b) - goalsDiff(a);
    if (diff !== 0) return diff;
    return b.goalsFor - a.goalsFor;
  });
}
