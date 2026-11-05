import { NextResponse } from "next/server";
import { getCurrentSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentSessionUser();

  if (!user) {
    return NextResponse.json(
      { authenticated: false, message: "Não autenticado." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: user.email,
      name: user.name,
      lastLogin: user.lastLogin,
    },
  });
}

