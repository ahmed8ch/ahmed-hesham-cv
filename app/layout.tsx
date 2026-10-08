import "@fontsource-variable/inter";
import "./globals.css";

export const metadata = {
  title: "Ahmed Hesham Lotfy — Software Developer",
  description: "Interactive CV and engineering portfolio for Ahmed Hesham Lotfy.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
