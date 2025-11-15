import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "lapip Store | Nextjs E-commerce template",
  description: "This is Home for lapip Store Template",
  // other metadata
};

export default function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
