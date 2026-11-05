import { NextRequest, NextResponse } from "next/server";
import { setUserPasswordWithToken } from "@/lib/auth";
import { createSignedSessionToken } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, token, password, confirmPassword } = body;

    if (!email || !token || !password) {
      return NextResponse.json(
        { success: false, message: "Campos obrigatórios não preenchidos." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "A confirmação de senha não confere com a senha digitada." },
        { status: 400 }
      );
    }

    const result = await setUserPasswordWithToken(email, token, password);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    // Cria sessão autenticada imediata após definir a senha
    const sessionToken = createSignedSessionToken(email);

    const response = NextResponse.json({
      success: true,
      message: result.message,
    });

    response.cookies.set("cuidar_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    });

    return response;
  } catch (error) {
    console.error("Erro na API set-password:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor ao definir senha." },
      { status: 500 }
    );
  }
}

