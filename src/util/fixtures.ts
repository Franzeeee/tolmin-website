// Shared types + adapter for manually-entered "člansko moštvo" fixtures/results
// (src/app/admin/clansko-tekme, /api/tekme) as consumed by the public pages
// (homepage hero widget, /clansko-mostvo/tekme).

export type FixtureStatus = 'SCHEDULED' | 'FINISHED';
export type FixtureVenue = 'HOME' | 'AWAY';

export type Fixture = {
  _id: string;
  league: string;
  season: string; // e.g. "2025/2026"
  round?: string;
  datetime: string; // ISO string
  venue: FixtureVenue; // Tolmin's venue
  place: string;
  opponent: string;
  opponentLogo?: string;
  status: FixtureStatus;
  tolminScore: number | null;
  opponentScore: number | null;
};

export type MatchTeam = {
  id: string;
  name: string;
  o_name: string;
  pos: number; // 1 = home (left), 2 = away (right)
  s_name: string;
  logoUrl?: string;
  scores: {
    FINAL_RESULT: string;
    RUNNING: string;
  };
};

export type Match = {
  id: string;
  season: string;
  o_status: string; // FINISHED | NOT_STARTED
  round: string;
  stage: { st_name: string };
  start: number; // epoch ms
  teams: MatchTeam[];
};

export const TOLMIN_LOGO = '/tolmin-logo.png';

function scoreStr(n: number | null | undefined): string {
  return n === null || n === undefined ? '' : String(n);
}

export function fixtureToMatch(f: Fixture): Match {
  const tolminTeam: MatchTeam = {
    id: 'tolmin',
    name: 'NK Tolmin',
    o_name: 'NK Tolmin',
    pos: f.venue === 'HOME' ? 1 : 2,
    s_name: 'TOL',
    logoUrl: TOLMIN_LOGO,
    scores: { FINAL_RESULT: scoreStr(f.tolminScore), RUNNING: '' },
  };

  const opponentTeam: MatchTeam = {
    id: 'opponent',
    name: f.opponent,
    o_name: f.opponent,
    pos: f.venue === 'HOME' ? 2 : 1,
    s_name: (f.opponent || '').slice(0, 3).toUpperCase(),
    logoUrl: f.opponentLogo,
    scores: { FINAL_RESULT: scoreStr(f.opponentScore), RUNNING: '' },
  };

  return {
    id: f._id,
    season: f.season,
    o_status: f.status === 'FINISHED' ? 'FINISHED' : 'NOT_STARTED',
    round: f.round ?? '',
    stage: { st_name: f.league },
    start: f.datetime ? new Date(f.datetime).getTime() : 0,
    teams: [tolminTeam, opponentTeam].sort((a, b) => a.pos - b.pos),
  };
}
