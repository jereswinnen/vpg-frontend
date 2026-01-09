import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Pagina niet gevonden</p>
      <Link
        href="/"
        className="mt-4 rounded-full bg-[var(--c-accent-light)] px-6 py-3 font-medium text-[var(--c-accent-dark)] transition-colors hover:bg-[var(--c-accent-light)]/90"
      >
        Terug naar home
      </Link>
    </div>
  );
}
