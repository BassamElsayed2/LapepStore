import React from "react";

import HeroBanner from "./Hero/HeroBanner";
import OffersSlider from "./OffersSlider";
import Categories from "./Categories";

import BestSeller from "./BestSeller";

const Home = () => {
  return (
    <main>
      {/* <Hero /> */}
      <HeroBanner />
      <Categories />
      <OffersSlider />
      {/* <NewArrival /> */}
      {/* <VideoSection /> */}
      {/* <PromoBanner /> */}
      <BestSeller />
      {/* <CounDown /> */}
      {/* <Newsletter /> */}
    </main>
  );
};

export default Home;
