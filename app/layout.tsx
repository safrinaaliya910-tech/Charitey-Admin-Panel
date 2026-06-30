import "./globals.css";

export const metadata = {
  title: "Charitey Admin",
  description: "Admin panel for Charitey",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}