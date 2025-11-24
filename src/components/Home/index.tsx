import React from "react";

import HeroBanner from "./Hero/HeroBanner";
import OffersSlider from "./OffersSlider";
import Categories from "./Categories";

import BestSeller from "./BestSeller";
import Testimonials from "./Testimonials";
import News from "./News";

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
      <Testimonials />
      <News />
      {/* <CounDown /> */}
      {/* <Newsletter /> */}
    </main>
  );
};

export default Home;
