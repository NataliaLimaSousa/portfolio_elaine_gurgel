import { NextRequest, NextResponse } from "next/server";
import { StorageNotConfiguredError } from "@/lib/storage";
import { authenticateUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const result = await authenticateUser(email, password, ip);

    // Primeiro acesso com código inicial → precisa trocar a senha (sem sessão ainda)
    if (result.success && result.mustChangePassword) {
      return NextResponse.json({
        success: true,
        mustChangePassword: true,
        message: result.message,
        redirectTo: result.redirectTo,
      });
    }

    if (!result.success || !result.sessionToken) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: result.message,
      user: result.user,
    });

    response.cookies.set("cuidar_session", result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    });

    return response;
  } catch (error) {
    console.error("Erro na API login:", error);
    if (error instanceof StorageNotConfiguredError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 503 });
    }
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor ao realizar autenticação." },
      { status: 500 }
    );
  }
}

