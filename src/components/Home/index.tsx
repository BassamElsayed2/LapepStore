import React from "react";
import VideoSection from "./VideoSection";
import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import BestSeller from "./BestSeller";
import Testimonials from "./Testimonials";
import News from "./News";

const Home = () => {
  return (
    <main>
      <VideoSection />
      <Hero />
      <Categories />
      <NewArrival />
      <PromoBanner />
      <BestSeller />
      <Testimonials />
      <News />
      {/* <CounDown /> */}
      {/* <Newsletter /> */}
    </main>
  );
};

export default Home;
