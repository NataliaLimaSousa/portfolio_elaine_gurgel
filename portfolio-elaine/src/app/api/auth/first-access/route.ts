import { NextRequest, NextResponse } from "next/server";
import { StorageNotConfiguredError } from "@/lib/storage";
import { requestPasswordResetWithCode } from "@/lib/auth";

// "Esqueceu a senha?": valida e-mail autorizado + código inicial
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || typeof email !== "string" || !code || typeof code !== "string") {
      return NextResponse.json(
        { success: false, message: "Informe o e-mail e o código inicial." },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const result = await requestPasswordResetWithCode(email, code, ip);

    if (!result.success) {
      return NextResponse.json(result, { status: 403 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro na API first-access:", error);
    if (error instanceof StorageNotConfiguredError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 503 });
    }
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor ao processar solicitação." },
      { status: 500 }
    );
  }
}
