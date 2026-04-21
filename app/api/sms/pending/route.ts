import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const BATCH_SIZE = 10;

export async function GET() {
  try {
    // 1. Récupérer SMS disponibles
    const smsList = await prisma.smsQueue.findMany({
      where: {
        status: "pending",
      },
      orderBy: {
        createdAt: "asc",
      },
      take: BATCH_SIZE,
    });

    if (smsList.length === 0) {
      return NextResponse.json([]);
    }

    // 2. LOCK ATOMIQUE (évite double worker)
    await prisma.smsQueue.updateMany({
      where: {
        id: {
          in: smsList.map((sms) => sms.id),
        },
        status: "pending", // sécurité anti race condition
      },
      data: {
        status: "processing",
        updatedAt: new Date(),
      },
    });

    // 3. Retourner les SMS lockés
    return NextResponse.json(smsList);
  } catch (error) {
    console.error("SMS QUEUE ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}