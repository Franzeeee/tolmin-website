// app/api/tolmin/route.ts
import { NextResponse } from "next/server";

const links = [
    `https://int.soccerway.com/v1/english/participant/soccer/full/11005/`,
    `https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&limit=20&onlydetails=true`,
    `https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&onlydetails=true`,
    `https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=30&onlydetails=true`,
    `https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=60&onlydetails=true`,
    `https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=90&onlydetails=true`,
    `https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=120&onlydetails=true`,
    `https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=150&onlydetails=true`,
    `https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=180&onlydetails=true`,
    `https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=210&onlydetails=true`,
    `https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=240&onlydetails=true`,
    `https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=270&onlydetails=true`,
    `https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=300&onlydetails=true`,
    `https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=330&onlydetails=true`,
    `https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=360&onlydetails=true`,
    `https://int.soccerway.com/legacy/v1/english/matches/?teamId=11005&before=1690732800&limit=30&offset=390&onlydetails=true`
];

export async function GET() {
  try {
    // Fetch all URLs concurrently
    const results = await Promise.all(
      links.map(async (url) => {
        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0", // trick in case site checks browser UA
          },
          cache: "no-store",
        });

        if (!res.ok) {
          return { url, error: `Failed to fetch: ${res.status}` };
        }

        const data = await res.json();
        return { data };
      })
    );

    return NextResponse.json(results);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error while fetching matches" },
      { status: 500 }
    );
  }
}
