import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, phone, amount } = await req.json();

  const payment = await prisma.payment.create({
    data: { name, phone, amount },
  });

  await prisma.smsQueue.create({
    data: {
      phone,
      message: `Paiement de ${amount} FCFA reçu`,
    },
  });

  return NextResponse.json(payment);
}