import type { NextConfig } from "next";

const parseOrigin = (value: string | undefined): string | null => {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const buildRemotePattern = (
  value: string | null,
):
  | {
      protocol: "http" | "https";
      hostname: string;
      port?: string;
      pathname: string;
    }
  | null => {
  if (!value) {
    return null;
  }

  const parsed = new URL(value);
  return {
    protocol: parsed.protocol === "https:" ? "https" : "http",
    hostname: parsed.hostname,
    ...(parsed.port ? { port: parsed.port } : {}),
    pathname: "/**",
  };
};

const isProduction = process.env.NODE_ENV === "production";
const apiOrigin = parseOrigin(process.env.NEXT_PUBLIC_API_BASE_URL);
const apiRemotePattern = buildRemotePattern(apiOrigin);

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${
    isProduction ? "" : " 'unsafe-eval'"
  }`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https: http:",
  "font-src 'self' data:",
  ["connect-src", "'self'", apiOrigin].filter(Boolean).join(" "),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "worker-src 'self' blob:",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=()",
  },
  ...(isProduction
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
] satisfies Array<{ key: string; value: string }>;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: apiRemotePattern ? [apiRemotePattern] : [],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
