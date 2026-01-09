export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero section with VPG accent colors */}
      <section className="o-grid o-grid--bleed bg-[var(--c-accent-dark)] py-16 text-white md:py-24">
        <div className="col-span-full">
          <h1>Welcome to VPG</h1>
          <p className="mt-4 text-white/80">
            Your trusted partner for quality solutions.
          </p>
          <div className="mt-8">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--c-accent-light)] px-6 py-3 font-medium text-[var(--c-accent-dark)] transition-colors hover:bg-[var(--c-accent-light)]/90"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Content section */}
      <section className="o-grid py-16">
        <div className="col-span-full">
          <h2>Our Services</h2>
          <p className="mt-4 text-muted-foreground">
            Phase 1 setup complete. The grid system and VPG branding colors are
            now configured.
          </p>
        </div>
      </section>
    </div>
  );
}
