import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getCurrentSessionUser } from "@/lib/auth";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/gif": ".gif",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const user = await getCurrentSessionUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Acesso negado. Sessão inválida." },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "Arquivo excede o tamanho máximo permitido de 5 MB." },
        { status: 400 }
      );
    }

    const mimeType = file.type;
    const extension = ALLOWED_MIME_TYPES[mimeType];

    if (!extension) {
      return NextResponse.json(
        {
          success: false,
          message: "Formato de arquivo não suportado. Use JPG, PNG, WEBP ou SVG.",
        },
        { status: 400 }
      );
    }

    // Gera nome de arquivo criptograficamente único para evitar colisões e path traversal
    const safeBaseName = crypto.randomBytes(16).toString("hex");
    const filename = `${safeBaseName}${extension}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      message: "Imagem enviada com sucesso!",
      url: publicUrl,
    });
  } catch (error) {
    console.error("Erro no upload de arquivo:", error);
    return NextResponse.json(
      { success: false, message: "Falha ao processar o upload da foto." },
      { status: 500 }
    );
  }
}

