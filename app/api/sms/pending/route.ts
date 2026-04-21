import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const BATCH_SIZE = 10;

// 🔥 CORS helper
function corsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

// 🔧 OPTIONS (preflight browser)
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return corsHeaders(response);
}

export async function GET() {
  try {
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
      return corsHeaders(NextResponse.json([]));
    }

    // 🔒 LOCK ATOMIQUE
    await prisma.smsQueue.updateMany({
      where: {
        id: { in: smsList.map((sms) => sms.id) },
        status: "pending",
      },
      data: {
        status: "processing",
        updatedAt: new Date(),
      },
    });

    return corsHeaders(NextResponse.json(smsList));
  } catch (error) {
    console.error("SMS QUEUE ERROR:", error);

    return corsHeaders(
      NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    );
  }
}