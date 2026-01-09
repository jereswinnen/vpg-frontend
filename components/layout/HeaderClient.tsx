"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import type { NavigationLink } from "@/types/content";

interface HeaderClientProps {
  navigation: NavigationLink[];
}

export function HeaderClient({ navigation }: HeaderClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-8 md:flex">
        {navigation.map((item) => (
          <div key={item.id} className="group relative">
            <Link
              href={item.url}
              className="font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              {item.label}
            </Link>
            {item.sub_items && item.sub_items.length > 0 && (
              <div className="invisible absolute left-0 top-full z-50 min-w-64 rounded-lg bg-white p-4 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                <div className="grid gap-2">
                  {item.sub_items.map((subItem) => (
                    <Link
                      key={subItem.id}
                      href={`/realisaties/${subItem.solution?.slug}`}
                      className="flex items-center gap-3 rounded-md p-2 hover:bg-gray-100"
                    >
                      {subItem.solution?.header_image?.url && (
                        <Image
                          src={subItem.solution.header_image.url}
                          alt={subItem.solution.header_image.alt || ""}
                          width={48}
                          height={48}
                          className="rounded object-cover"
                        />
                      )}
                      <span>{subItem.solution?.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-white md:hidden">
          <nav className="flex flex-col p-4">
            {navigation.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="border-b py-4 text-lg"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
