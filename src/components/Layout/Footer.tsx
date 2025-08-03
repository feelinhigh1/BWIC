import React from "react";
import { navItems } from "@/utils/navItems";
import { contactInfo } from "@/utils/ContactInformation";
import { socialMediaLinks } from "@/utils/SocialMediaLinks";

const FooterSection: React.FC = () => {
  return (
    <footer className="bg-gradient-to-tr from-slate-900 to-slate-800 text-white px-6 pt-12 pb-8">
      {/* Main content */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-16 md:gap-12">
        {/* Branding */}
        <div className="md:flex-1 max-w-sm">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            Blue Whale Investment
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Empowering investors with smart financial tools, expert strategies,
            and long-term growth insights. We believe in building wealth that
            lasts.
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:flex-1 max-w-[200px]">
          <h3 className="text-xl font-semibold text-blue-300 mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.path}
                  className="text-slate-300 hover:text-blue-400 transition"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="md:flex-1 max-w-xs">
          <h3 className="text-xl font-semibold text-blue-300 mb-3">
            Contact Us
          </h3>
          <address className="not-italic text-slate-300 leading-relaxed">
            {contactInfo.address.street}
            <br />
            {contactInfo.address.city}, {contactInfo.address.country}
          </address>
          <p className="mt-3 text-slate-300">
            Email:{" "}
            <a
              href={`mailto:${contactInfo.email}`}
              className="hover:text-blue-400"
            >
              {contactInfo.email}
            </a>
            <br />
            Phone:{" "}
            <a
              href={`tel: ${contactInfo.phone}`}
              className="hover:text-blue-400"
            >
              {contactInfo.phone}
            </a>
          </p>
        </div>
      </div>

      {/* Social Icons */}
      <div className="mt-12 flex justify-center gap-6">
        {socialMediaLinks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="group w-12 h-12 flex items-center justify-center bg-slate-700 rounded-full hover:bg-blue-500 transition transform hover:scale-110"
          >
            <svg
              className="w-6 h-6 text-white group-hover:text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d={social.icon} />
            </svg>
          </a>
        ))}
      </div>

      {/* Divider & Copyright */}
      <div className="mt-14 border-t border-slate-700 pt-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Blue Whale Investment. All rights
        reserved.
      </div>
    </footer>
  );
};

export default FooterSection;
