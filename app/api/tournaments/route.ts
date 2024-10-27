import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../libs/mongo";
import type { ITournament } from "../../../types/tournaments";

export async function GET(request: NextRequest) {
  try {
    const db = await dbConnect();
    const collection = db.collection<ITournament>("tournaments");

    // TODO: To increase performnce as my dataset grows, I should introduce indexing:
    // db.tournaments.createIndex({ tournament_id: -1 });

    // Define the aggregation pipeline
    const pipeline = [
      {
        $sort: { tournament_id: -1 } // Sorts tournaments by tournament_id in descending order
      },
      {
        $limit: 50 // Limits the result to the first 50 documents
      }
    ];

    // Execute the aggregation pipeline
    const tournaments = await collection.aggregate(pipeline).toArray();

    return NextResponse.json(tournaments);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    return NextResponse.json(
      { message: "Server Error", error: String(error) },
      { status: 500 }
    );
  }
}
