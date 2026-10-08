import "@fontsource-variable/inter";
import "./globals.css";

export const metadata = {
  title: "Ahmed Hesham Lotfy — Software Developer",
  description: "Interactive CV and engineering portfolio for Ahmed Hesham Lotfy.",
  keywords: ["Ahmed Hesham Lotfy", "software developer", "Flutter", "React", "TypeScript"],
  authors: [{ name: "Ahmed Hesham Lotfy" }],
  openGraph: {
    title: "Ahmed Hesham Lotfy — Software Developer",
    description: "Interactive CV and engineering portfolio for Ahmed Hesham Lotfy.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
