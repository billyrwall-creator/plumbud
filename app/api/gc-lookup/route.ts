import { NextRequest, NextResponse } from "next/server";
import { lookupBoilerByGcNumber } from "@/services/gc-lookup-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = typeof body?.gcNumber === "string" ? body.gcNumber : "";

    const result = await lookupBoilerByGcNumber(input);

    if (result.unavailable) {
      return NextResponse.json(result, { status: result.statusCode ?? 503 });
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
