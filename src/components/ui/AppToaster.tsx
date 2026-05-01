import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      gap={14}
      theme="light"
      expand={false}
      offset={{ right: 24, bottom: 24 }}
      mobileOffset={{ right: 16, left: 16, bottom: 16 }}
      toastOptions={{
        style: {
          fontFamily: "inherit",
        },
      }}
    />
  );
}
