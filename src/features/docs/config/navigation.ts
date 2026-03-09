export interface NavItem {
  title: string;
  href?: string;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const docsNavigation: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/doc" },
      { title: "Installation", href: "/doc/installation" },
      { title: "Design Pattern", href: "/doc/design-pattern" },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Login Form", href: "/login" },
      { title: "Register Form", href: "/register" },
      { title: "Forgot Password", href: "/forgot-password" },
      { title: "Reset Password", href: "/reset-password" },
      { title: "OTP Verification", href: "/otp" },
    ],
  },
  {
    title: "Login SNS",
    items: [
      { title: "Google", href: "/doc/login-google" },
      { title: "Facebook", href: "/doc/login-facebook" },
      { title: "Instagram", href: "/doc/login-instagram" },
      { title: "LINE", href: "/doc/login-line" },
    ],
  },
  {
    title: "Test Case",
    items: [
      { title: "Test Case", href: "/doc/test-case" },
    ],
  },
];

export const headerNavigation = [
  { title: "Showcase", href: "https://tomosia-showcase.vercel.app/" },
  { title: "TOMOSIA AI", href: "https://tomosia.com/" },
  { title: "Blog", href: "https://blog.tomosia.com.vn/trang-chu/" },
];
