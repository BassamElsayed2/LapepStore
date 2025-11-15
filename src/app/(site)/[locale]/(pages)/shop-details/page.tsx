import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Details Page | lapip Store Nextjs E-commerce template",
  description: "This is Shop Details Page for lapip Store Template",
  // other metadata
};

interface ShopDetailsPageProps {
  searchParams: Promise<{ id?: string }>;
}

const ShopDetailsPage = async ({ searchParams }: ShopDetailsPageProps) => {
  const params = await searchParams;

  return (
    <main>
      <ShopDetails productId={params.id} />
    </main>
  );
};

export default ShopDetailsPage;
