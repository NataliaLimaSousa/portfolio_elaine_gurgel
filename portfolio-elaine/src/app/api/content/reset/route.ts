import { NextResponse } from "next/server";
import { StorageNotConfiguredError } from "@/lib/storage";
import { resetContent } from "@/lib/content-store";
import { getCurrentSessionUser } from "@/lib/auth";

export async function POST() {
  const user = await getCurrentSessionUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Acesso negado. Não autenticado." },
      { status: 401 }
    );
  }

  try {
    const defaults = await resetContent(user.email);
    return NextResponse.json({
      success: true,
      message: "Conteúdo restaurado para o padrão original com sucesso!",
      content: defaults,
    });
  } catch (error) {
    console.error("Erro ao resetar conteúdo:", error);
    if (error instanceof StorageNotConfiguredError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 503 });
    }
    return NextResponse.json(
      { success: false, message: "Erro ao restaurar conteúdo padrão." },
      { status: 500 }
    );
  }
}

