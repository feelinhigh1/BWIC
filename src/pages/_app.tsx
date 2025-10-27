import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import AdminLayout from "@/components/admin/AdminLayout"; // your admin layout
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // check if the current route starts with /admin
  const isAdminRoute = router.pathname.startsWith("/admin");

  const ActiveLayout = isAdminRoute ? AdminLayout : Layout;

  return (
    <ActiveLayout title={"Admin Panel"}>
      <Component {...pageProps} />
    </ActiveLayout>
  );
}
