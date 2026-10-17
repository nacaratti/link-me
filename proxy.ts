import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/env";

/**
 * Renova a sessão do Supabase e protege as rotas logadas. É só a checagem
 * otimista; cada página/ação confere o usuário de novo no servidor.
 */
export async function proxy(request: NextRequest) {
  // Se o endereço de retorno não estiver liberado no Supabase Auth, o login
  // volta para a Site URL ("/") com ?code=. Encaminha para o callback.
  if (request.nextUrl.pathname === "/" && request.nextUrl.searchParams.has("code")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    if (!url.searchParams.has("next")) url.searchParams.set("next", "/painel");
    return NextResponse.redirect(url);
  }
  // A landing não precisa de sessão
  if (request.nextUrl.pathname === "/") return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPrivate = path.startsWith("/painel") || path.startsWith("/criar");

  if (isPrivate && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }
  if (path === "/entrar" && user) {
    return NextResponse.redirect(new URL("/painel", request.url));
  }

  return response;
}

export const config = {
  // Só onde a sessão importa; as páginas públicas (/:username) ficam fora e em cache
  matcher: ["/", "/painel/:path*", "/criar/:path*", "/entrar", "/auth/:path*"],
};
