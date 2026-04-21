import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const smsList = await prisma.smsQueue.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  // 🔒 lock immédiat pour éviter double envoi
  await prisma.smsQueue.updateMany({
    where: {
      id: { in: smsList.map((sms) => sms.id) },
    },
    data: {
      status: "processing",
    },
  });

  return NextResponse.json(smsList);
}