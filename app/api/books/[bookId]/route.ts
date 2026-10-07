import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { ApiError } from "@/lib/api-error";
import { getBookDetail } from "./book-detail";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookId: string }> },
) {
  const { bookId } = await params;

  if (!ObjectId.isValid(bookId)) {
    return NextResponse.json({ error: "Invalid book ID" }, { status: 400 });
  }

  try {
    const book = await getBookDetail(bookId);
    return NextResponse.json({ book });
  } catch (err) {
    console.error("[GET /api/books/[bookId]]", err);
    const apiError = ApiError.fromUnknown(err);
    return NextResponse.json(
      { error: apiError.message },
      { status: apiError.statusCode ?? 500 },
    );
  }
}
