import React, { useState } from "react";

import "./_app.scss";

import FeaturedIn from "./FeaturedIn";
import { MainFrameBackground } from "./WelcomeSection";
import Header from "./Header";
import BlogsFrame from "./TestimonialsFrame";
import MainFooter from "./FooterSection";
import CallToAction from "./CallToAction";


function delay(ms) {
  return new Promise(resolve => setTimeout(() => {
    console.log("triggered");
    resolve("abc");
  }, ms));
}


export default function App() {

  const [navOpened, setNavOpened] = useState(false);
  return (
    <div className={"root-container " + (navOpened ? "open-navigation" : "")}>
      <Header onNavToggle={() => {

        console.log("toggle");
        setNavOpened(!navOpened);
      }} />
      <MainFrameBackground />
      <main className="main-content">
        <FeaturedIn />
        <BlogsFrame />
        <CallToAction />
      </main>
      <MainFooter />
      {/*<SubscribeFrame />*/}
      {/*<FeaturedIn />*/}
      {/*<FooterSection />*/}
    </div>
  );
}

