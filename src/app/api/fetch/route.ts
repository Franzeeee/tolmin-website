import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "Missing 'url' query parameter" },
        { status: 400 }
      );
    }

    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${res.status}` },
        { status: res.status }
      );
    }

    // Check content type to determine how to handle the response
    const contentType = res.headers.get("Content-Type");

    if (contentType?.includes("application/json")) {
      // Handle JSON responses
      const jsonData = await res.json();
      return NextResponse.json(jsonData);
    } else if (contentType?.includes("image/")) {
      // Handle image responses (e.g., PNG, JPG)
      const imageBuffer = await res.arrayBuffer();
      return new NextResponse(imageBuffer, {
        headers: {
          "Content-Type": contentType ?? "application/octet-stream", // Pass the exact image type or fallback
        },
      });
    } else if (contentType?.includes("text/")) {
      // Handle text responses (e.g., plain text, HTML)
      const textData = await res.text();
      return new NextResponse(textData, {
        headers: { "Content-Type": contentType ?? "text/plain" },
      });
    } else {
      // Handle other content types (e.g., PDF, audio, etc.)
      const blob = await res.blob();
      return new NextResponse(blob, {
        headers: {
          "Content-Type": contentType ?? "application/octet-stream",
        },
      });
    }

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error while fetching link" },
      { status: 500 }
    );
  }
}
