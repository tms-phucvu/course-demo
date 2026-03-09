import { fontClassName, fontVariable } from "@/core/config/fonts";
import "./globals.css";

/**
 * Root layout must include <html> and <body> so that 404 and other
 * non-[locale] routes still render a valid document (Next.js requirement).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning className={fontVariable}>
      <head>
        <link rel='icon' href='/image/logo.webp' type='image/webp' />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("color-theme");if(s){var ok=["zinc","red","orange","amber","yellow","lime","green","emerald","teal","cyan","sky","blue","indigo","violet","purple","fuchsia","pink","rose","slate","gray","neutral","stone"];if(ok.indexOf(s)!==-1)document.documentElement.setAttribute("data-color-theme",s);}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${fontClassName} w-full max-w-full min-w-0`}>
        {children}
      </body>
    </html>
  );
}
