import React from "react";

import HeroBanner from "./Hero/HeroBanner";
import OffersSlider from "./OffersSlider";
import Categories from "./Categories";
import BestSeller from "./BestSeller";
import GoogleRatingPromo from "./GoogleRatingPromo";

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
      {/* Google Rating Promo - Get discount for rating */}
      {/* <GoogleRatingPromo /> */}
      {/* <CounDown /> */}
      {/* <Newsletter /> */}
    </main>
  );
};

export default Home;
