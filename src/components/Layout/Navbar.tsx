import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { navItems as defaultNavItems, NavbarItem } from "@/utils/navItems";
import Link from "next/link";

interface NavbarProps {
  brand?: {
    name: string;
    logo?: string;
  };
  navItems?: NavbarItem[];
}

const Navbar: React.FC<NavbarProps> = ({
  brand = {
    name: "BWIC",
    logo: "",
  },
  navItems = defaultNavItems,
}) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white text-black shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <Link href="/">
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="w-8 h-8"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {brand.name[0]}
                </div>
              )}
            </Link>
            <Link href="/">
              <span className="text-lg font-semibold">{brand.name}</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={`hover:text-blue-600 ${
                    pathname === item.path ? "text-blue-700 font-semibold" : ""
                  }`}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <ul className="space-y-2 pb-4 pt-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    className={`block py-2 px-3 rounded-md ${
                      pathname === item.path
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
