import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import Services from "./Services";
import Footer from "./Footer";
import HowItWorks from "./Working";
import FindBuddy from "./FindBuddy";

const Landing = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <Services />
      <FindBuddy />
      <Footer />
    </div>
  );
};

export default Landing;
