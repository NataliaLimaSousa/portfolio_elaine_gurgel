import { NextRequest, NextResponse } from "next/server";
import { getCurrentSessionUser } from "@/lib/auth";
import { deleteContactMessage, listContactMessages, setMessageRead } from "@/lib/contact";
import { StorageNotConfiguredError } from "@/lib/storage";

// Todas as operações exigem sessão autenticada (área restrita).
const headers = { "Cache-Control": "no-store" };

async function requireUser() {
  return getCurrentSessionUser();
}

function failure(error: unknown) {
  console.error("Erro na API contact/messages:", error instanceof Error ? error.message : "desconhecido");
  if (error instanceof StorageNotConfiguredError) {
    return NextResponse.json({ success: false, message: error.message }, { status: 503, headers });
  }
  return NextResponse.json({ success: false, message: "Erro ao processar a solicitação." }, { status: 500, headers });
}

export async function GET() {
  if (!(await requireUser())) {
    return NextResponse.json({ success: false, message: "Acesso negado." }, { status: 401, headers });
  }
  try {
    return NextResponse.json({ success: true, messages: await listContactMessages() }, { headers });
  } catch (error) {
    return failure(error);
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await requireUser())) {
    return NextResponse.json({ success: false, message: "Acesso negado." }, { status: 401, headers });
  }
  try {
    const { id, read } = await req.json();
    if (typeof id !== "string" || typeof read !== "boolean") {
      return NextResponse.json({ success: false, message: "Dados inválidos." }, { status: 400, headers });
    }
    const ok = await setMessageRead(id, read);
    return NextResponse.json({ success: ok }, { status: ok ? 200 : 404, headers });
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireUser())) {
    return NextResponse.json({ success: false, message: "Acesso negado." }, { status: 401, headers });
  }
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Informe o id." }, { status: 400, headers });
    }
    const ok = await deleteContactMessage(id);
    return NextResponse.json({ success: ok }, { status: ok ? 200 : 404, headers });
  } catch (error) {
    return failure(error);
  }
}
