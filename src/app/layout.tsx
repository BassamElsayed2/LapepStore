import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lapip Store | لبيب ستور",
  description: "Your trusted electronics store in Egypt",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning={true}>
      <head />
      <body>{children}</body>
    </html>
  );
}
