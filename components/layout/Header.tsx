import Link from "next/link";
import { getNavigation } from "@/lib/content";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  let navigation: Awaited<ReturnType<typeof getNavigation>> = [];

  try {
    navigation = await getNavigation("header");
  } catch (error) {
    console.error("Failed to fetch header navigation:", error);
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="o-grid py-4">
        <div className="col-span-full flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[var(--c-accent-dark)]">
            VPG
          </Link>
          <HeaderClient navigation={navigation} />
        </div>
      </div>
    </header>
  );
}
