import { NextRequest, NextResponse } from "next/server";
import { extractZipEntries, compareZipEntries } from "@/services/zipDiff";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Parse multipart form data
  const formData = await req.formData();
  const zip1 = formData.get("zip1");
  const zip2 = formData.get("zip2");

  if (!zip1 || !zip2 || !(zip1 instanceof Blob) || !(zip2 instanceof Blob)) {
    return NextResponse.json(
      { error: "Both ZIP files are required." },
      { status: 400 }
    );
  }

  try {
    const [entries1, entries2] = await Promise.all([
      extractZipEntries(await zip1.arrayBuffer()),
      extractZipEntries(await zip2.arrayBuffer()),
    ]);
    const diff = compareZipEntries(entries1, entries2);
    return NextResponse.json({ diff });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
