import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
      <p className="t-label">404</p>
      <h1 className="t-chapter mt-4">Essa página ainda não existe.</h1>
      <p className="mt-4 text-muted">Que tal criar a sua? Leva uns três minutos.</p>
      <Link
        href="/entrar"
        className="mt-8 inline-flex h-12 w-fit items-center rounded-full bg-ink px-6 font-medium text-bg transition-opacity hover:opacity-85"
      >
        Criar minha página
      </Link>
    </main>
  );
}
