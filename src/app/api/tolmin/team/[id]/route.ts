import { NextResponse } from "next/server";

const teamId = "11005"; // NK Tolmin team ID
const links = [
  `https://int.soccerway.com/v1/english/participant/soccer/full/${teamId}/`,
];

export async function GET() {
  try {
    const results = await Promise.all(
      links.map(async (url) => {
        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0", // pretend browser
          },
          cache: "no-store",
        });

        if (!res.ok) {
          console.warn(`Failed to fetch ${url}: ${res.status}`);
          return [];
        }

        const data = await res.json();

        // Make sure to return matches array if it exists
        return data.matches ?? [];
      })
    );

    // Flatten matches from multiple links
    const allMatches = results.flat();

    return NextResponse.json(allMatches);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error while fetching matches" },
      { status: 500 }
    );
  }
}
