import { NextRequest, NextResponse } from "next/server";
import { generateFirstAccessLink } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "E-mail obrigatório." },
        { status: 400 }
      );
    }

    const origin = req.nextUrl.origin || "http://localhost:3000";
    const result = await generateFirstAccessLink(email, origin);

    if (!result.success) {
      return NextResponse.json(result, { status: 403 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro na API first-access:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor ao processar solicitação." },
      { status: 500 }
    );
  }
}

