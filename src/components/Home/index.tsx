import React from "react";

import HeroBanner from "./Hero/HeroBanner";
import OffersSlider from "./OffersSlider";
import Categories from "./Categories";
import BestSeller from "./BestSeller";

const Home = () => {
  return (
    <main className="bg-white">
      {/* <Hero /> */}
      <HeroBanner />
      <Categories />
      <OffersSlider />
      {/* <NewArrival /> */}
      {/* <VideoSection /> */}
      {/* <PromoBanner /> */}
      <BestSeller />
      {/* Google Rating Promo - Get discount for rating */}
      {/* <GoogleRatingPromo /> */}
      {/* <CounDown /> */}
      {/* <Newsletter /> */}
    </main>
  );
};

export default Home;
