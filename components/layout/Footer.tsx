import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { getNavigation, getSiteParameters } from "@/lib/content";

export async function Footer() {
  let navigation: Awaited<ReturnType<typeof getNavigation>> = [];
  let parameters: Awaited<ReturnType<typeof getSiteParameters>> = null;

  try {
    [navigation, parameters] = await Promise.all([
      getNavigation("footer"),
      getSiteParameters(),
    ]);
  } catch (error) {
    console.error("Failed to fetch footer data:", error);
  }

  return (
    <footer className="bg-[var(--c-accent-dark)] py-16 text-white">
      <div className="o-grid">
        <div className="col-span-full grid gap-12 md:grid-cols-3">
          {/* Navigation */}
          <div>
            <h3 className="mb-4 font-semibold">Navigatie</h3>
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="text-white/70 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          {parameters && (
            <div>
              <h3 className="mb-4 font-semibold">Contact</h3>
              <div className="flex flex-col gap-3 text-white/70">
                {parameters.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-1 size-4 shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: parameters.address }} />
                  </div>
                )}
                {parameters.phone && (
                  <a
                    href={`tel:${parameters.phone}`}
                    className="flex items-center gap-2 transition-colors hover:text-white"
                  >
                    <Phone className="size-4" />
                    <span>{parameters.phone}</span>
                  </a>
                )}
                {parameters.email && (
                  <a
                    href={`mailto:${parameters.email}`}
                    className="flex items-center gap-2 transition-colors hover:text-white"
                  >
                    <Mail className="size-4" />
                    <span>{parameters.email}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold">Juridisch</h3>
            {parameters?.vat_number && (
              <p className="text-white/70">BTW: {parameters.vat_number}</p>
            )}
          </div>
        </div>

        <div className="col-span-full mt-12 border-t border-white/20 pt-8 text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} VPG. Alle rechten voorbehouden.
        </div>
      </div>
    </footer>
  );
}
