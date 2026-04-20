import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { id } = await req.json();

  await prisma.smsQueue.update({
    where: { id },
    data: { status: "failed" },
  });

  return NextResponse.json({ success: true });
}