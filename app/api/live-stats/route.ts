import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const client = await clientPromise;
  const database = client.db(process.env.DATABASE_NAME);
  const books = database.collection("books");

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  let isClosed = false;

  const sendCount = async () => {
    if (isClosed) return;
    try {
      const count = await books.countDocuments();
      await writer.write(encoder.encode(`data: ${JSON.stringify({ total: count })}\n\n`));
    } catch (err) {
      console.error("Error in sendCount:", err);
      await closeStream();
    }
  };

  const closeStream = async () => {
    if (isClosed) return;
    isClosed = true;
    try { await bookStream.close(); } catch (err) { console.error(err); }
    try { await writer.close(); } catch (err) { console.error(err); }
  };

  const pipeline = [
    { $match: { operationType: { $in: ["insert", "delete"] } } },
  ];

  const bookStream = books.watch(pipeline);

  bookStream.on("change", () => {
    sendCount().catch(console.error);
  });

  bookStream.on("error", (err) => {
    console.error("Change stream error:", err);
    closeStream().catch(console.error);
  });

  request.signal.addEventListener("abort", () => {
    closeStream().catch(console.error);
  });

  writer.write(encoder.encode(": ping\n\n")).catch(console.error);
  sendCount().catch(console.error);

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}