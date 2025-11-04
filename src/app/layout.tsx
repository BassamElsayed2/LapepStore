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
  // Root layout should not have html/body when using locale layout
  return children;
}
