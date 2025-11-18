import React from "react";
import ShopWithoutSidebar from "@/components/ShopWithoutSidebar";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop Page | lapip Store",
  description: "This is Shop Page for lapip Store Template",
  // other metadata
};

const ShopPage = () => {
  return (
    <main>
      <ShopWithoutSidebar />
    </main>
  );
};

export default ShopPage;
