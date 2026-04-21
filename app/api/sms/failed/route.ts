import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function cors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 204 }));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const id = body.id;

    if (!id) {
      return cors(
        NextResponse.json({ error: "Missing id" }, { status: 400 })
      );
    }

    await prisma.smsQueue.update({
      where: { id },
      data: { status: "failed" },
    });

    return cors(NextResponse.json({ success: true }));
  } catch (e) {
    console.error(e);

    return cors(
      NextResponse.json(
        { error: "Server error" },
        { status: 500 }
      )
    );
  }
}