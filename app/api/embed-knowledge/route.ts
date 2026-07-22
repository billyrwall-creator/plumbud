import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase-admin";

export async function POST() {
  try {
    const { data: rows, error: fetchError } = await supabaseAdmin
      .from("knowledge_base")
      .select("id, content")
      .is("embedding", null)
      .limit(1);

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    const row = rows?.[0];

    if (!row) {
      return NextResponse.json({
        message: "No rows need embeddings.",
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY!,
        },
        body: JSON.stringify({
          model: "models/gemini-embedding-001",
          content: {
            parts: [
              {
                text: row.content,
              },
            ],
          },
          outputDimensionality: 768,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result },
        { status: response.status }
      );
    }

    const embedding = result.embedding?.values;

    if (!Array.isArray(embedding)) {
      throw new Error("Gemini did not return an embedding.");
    }

    const { error: updateError } = await supabaseAdmin
      .from("knowledge_base")
      .update({ embedding })
      .eq("id", row.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({
      message: "Embedding created successfully.",
      rowId: row.id,
      dimensions: embedding.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error.",
      },
      { status: 500 }
    );
  }
}
