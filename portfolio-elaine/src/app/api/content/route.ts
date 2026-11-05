import { NextRequest, NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content-store";
import { getCurrentSessionUser } from "@/lib/auth";
import { PortfolioData } from "@/lib/types";

export async function GET() {
  const content = getContent();
  return NextResponse.json(content, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentSessionUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Acesso negado. Sessão inválida ou expirada." },
      { status: 401 }
    );
  }

  try {
    const body: PortfolioData = await req.json();

    if (!body || !body.hero || !body.contact) {
      return NextResponse.json(
        { success: false, message: "Estrutura de dados inválida." },
        { status: 400 }
      );
    }

    const saved = saveContent(body, user.email);

    return NextResponse.json({
      success: true,
      message: "Todas as alterações foram salvas com sucesso!",
      content: saved,
    });
  } catch (error) {
    console.error("Erro ao salvar conteúdo:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao processar e salvar os dados do portfólio." },
      { status: 500 }
    );
  }
}

