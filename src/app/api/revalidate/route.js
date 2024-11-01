import { revalidatePath } from "next/cache"; // Importa a função de revalidação
import { NextResponse } from "next/server";

export async function POST(request) {
  const { secret, path } = await request.json(); // Extrai os dados do corpo da requisição

  // Verifica o segredo para segurança
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    // Revalida a página no caminho especificado
    revalidatePath(path);
    return NextResponse.json({ revalidated: true });
  } catch (error) {
    console.log("error :", error);
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}
