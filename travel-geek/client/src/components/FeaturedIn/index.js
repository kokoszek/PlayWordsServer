import React from "react";
import "./featured-in.scss";

export default function FeaturedIn(props) {
  return (
    <section className={"featured-in-section"}>
      <header>as featured in</header>
      <div className={"featured-in-section-content"}>
        <div className="business-insider-img"></div>
        <div className="forbes-img"></div>
        <div className="techcrunch-img"></div>
        <div className="the-new-york-times-img"></div>
        <div className="usa-today-img"></div>
      </div>
      <div className="gray-overlay"></div>
    </section>
  );
}
