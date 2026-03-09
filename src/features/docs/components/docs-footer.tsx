import { Link } from "@/i18n/routing";
import { Facebook, Linkedin, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

export function DocsFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border py-12 px-4 md:px-8 relative z-20">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/image/logo.webp"
                alt="Logo"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              A comprehensive Next.js authentication template with NextAuth.js,
              featuring social login providers, multi-language support, and
              modern UI components.
            </p>
            <ul className="flex items-center gap-3">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted/50 hover:bg-primary/10 border border-border hover:border-primary/50 flex items-center justify-center transition-all group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted/50 hover:bg-primary/10 border border-border hover:border-primary/50 flex items-center justify-center transition-all group"
                >
                  <Facebook className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted/50 hover:bg-primary/10 border border-border hover:border-primary/50 flex items-center justify-center transition-all group"
                >
                  <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold text-foreground mb-4">
              Documentation
            </h4>
            <div className="flex flex-col gap-3">
              <Link
                href="/doc"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Getting Started
              </Link>
              <Link
                href="/doc/installation"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Installation
              </Link>
              <Link
                href="/doc/design-pattern"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Design Pattern
              </Link>
            </div>
          </div>

          {/* Providers */}
          <div>
            <h4 className="text-base font-bold text-foreground mb-4">
              Login Providers
            </h4>
            <div className="flex flex-col gap-3">
              <Link
                href="/doc/login-google"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Google
              </Link>
              <Link
                href="/doc/login-facebook"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Facebook
              </Link>
              <Link
                href="/doc/login-instagram"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Instagram
              </Link>
              <Link
                href="/doc/login-line"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                LINE
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-bold text-foreground mb-4">
              Contact
            </h4>
            <div className="flex flex-col gap-4">
              <a
                href="tel:+842432016955"
                className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>(+84) 243-201-6955</span>
              </a>
              <a
                href="mailto:company@tomosia.com"
                className="flex items-start gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>company@tomosia.com</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  2F, Au Viet Building, No.1 Le Duc Tho Street, Mai Dich Ward,
                  Cau Giay, Ha Noi
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            Copyright ©{currentYear}{" "}
            <a href="https://tomosia.com" className="text-primary hover:underline">
              TOMOSIA Viet Nam
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
