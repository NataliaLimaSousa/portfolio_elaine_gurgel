import { NextRequest, NextResponse } from "next/server";
import { StorageNotConfiguredError } from "@/lib/storage";
import { getContent, saveContent } from "@/lib/content-store";
import { getCurrentSessionUser } from "@/lib/auth";
import { PortfolioData } from "@/lib/types";
import { toPublicContent } from "@/lib/pending";

export async function GET() {
  const content = await getContent();
  // Visitantes recebem só o conteúdo confirmado; quem está logado no painel recebe tudo
  const user = await getCurrentSessionUser();
  return NextResponse.json(user ? content : toPublicContent(content), {
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

    const saved = await saveContent(body, user.email);

    return NextResponse.json({
      success: true,
      message: "Todas as alterações foram salvas com sucesso!",
      content: saved,
    });
  } catch (error) {
    console.error("Erro ao salvar conteúdo:", error);
    if (error instanceof StorageNotConfiguredError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 503 });
    }
    return NextResponse.json(
      { success: false, message: "Erro ao processar e salvar os dados do portfólio." },
      { status: 500 }
    );
  }
}

