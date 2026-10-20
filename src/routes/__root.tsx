import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "LATAM 友";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${APP_NAME} · Formulário de recrutamento` },
      {
        name: "description",
        content:
          "Formulário de recrutamento da guilda LATAM 友. Recrutamento aberto para Free Fire.",
      },
      { property: "og:title", content: "LATAM 友" },
      {
        property: "og:description",
        content:
          "Formulário de recrutamento da guilda LATAM 友. Recrutamento aberto para Free Fire.",
      },
      { property: "og:image", content: "https://latam2.nyxaria.workers.dev/latam-preview.jpg" },
      { property: "og:image:secure_url", content: "https://latam2.nyxaria.workers.dev/latam-preview.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "600" },
      { property: "og:image:height", content: "600" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://latam2.nyxaria.workers.dev" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "LATAM 友" },
      {
        name: "twitter:description",
        content:
          "Formulário de recrutamento da guilda LATAM 友. Recrutamento aberto para Free Fire.",
      },
      { name: "twitter:image", content: "https://latam2.nyxaria.workers.dev/latam-preview.jpg" },
      { name: "theme-color", content: "#07090e" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preload", href: "/fonts/bebas-neue.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: "/fonts/outfit.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="pt-BR" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
          <Toaster
            theme="dark"
            position="top-center"
            toastOptions={{
              className: "latam-toast",
            }}
          />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
