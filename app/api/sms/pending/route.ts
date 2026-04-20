import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const sms = await prisma.smsQueue.findFirst({
    where: { status: "pending" },
  });

  return NextResponse.json(sms || null);
}