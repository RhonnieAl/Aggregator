import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../libs/mongo";
import type { ITournament } from "../../../../types/tournaments";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log(`API Request Received for ID: ${id}`);

  try {
    const db = await dbConnect();
    const collection = db.collection<ITournament>("tournaments");

    let tournament: ITournament | null = null;

    if (id === "latest") {
      // Fetch the tournament with the highest tournament_id
      tournament = await collection
        .find({})
        .sort({ tournament_id: -1 })
        .limit(1)
        .next();
      // console.log("Fetched latest tournament:", tournament);
    } else {
      // Fetch the tournament by specific id
      const tournamentId = Number(id);
      if (isNaN(tournamentId)) {
        console.warn(`Invalid tournament ID received: ${id}`);
        return NextResponse.json(
          { message: "Invalid tournament ID" },
          { status: 400 }
        );
      }

      tournament = await collection.findOne({ tournament_id: tournamentId });
      // console.log(`Fetched tournament ID ${tournamentId}:`, tournament);
    }

    if (!tournament) {
      console.warn(`Tournament not found for ID: ${id}`);
      return NextResponse.json(
        { message: "Tournament not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tournament);
  } catch (error) {
    console.error("Error fetching tournament:", error);
    return NextResponse.json(
      { message: "Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
