import React from "react";
import Navbar from "./Navbar"; // adjust path if needed
import FooterSection from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  brand?: {
    name: string;
    logo?: string;
  };
  navItems?: { name: string; path: string }[];
}

export default function Layout({ children, brand, navItems }: LayoutProps) {
  return (
    <>
      <Navbar brand={brand} navItems={navItems} />
      <main className="mt-12">{children}</main>
      <FooterSection />
    </>
  );
}
