import React from "react";
import "./footer-section.scss";

export default function MainFooter(props) {
  return (
    <section className={"main-footer"}>
      <div className="main-footer-content container">
        <section className="logo">
          <header>Created by</header>
          <img src={"img/frysztacki-tech-logo-vector-inverted.png"} className="logo-img" />
          <div className="rights-note">
            Copyrights Frysztacki.Tech 2022. All rights reserved
          </div>
        </section>
        <section className="technology">
          <header>
            Technology
          </header>
          <ul>
            <li>Overview</li>
            <li>AWS</li>
            <li>Source code</li>
          </ul>
        </section>
        <section className="social-media">
          <header>
            Social media
          </header>
          <ul>
            <li>facebook</li>
            <li>twitter</li>
            <li>discord</li>
          </ul>
        </section>
        <section className="team">
          <header>
            Team
          </header>
          <ul>
            <li>About us</li>
            <li>Careers</li>
            <li>Contact me</li>
          </ul>
        </section>
        <section className="solutions">
          <header>
            Solutions
          </header>
          <ul>
            <li>Funds</li>
            <li>Blogs</li>
            <li>Getting started</li>
            <li>Invest</li>
          </ul>
        </section>
      </div>
    </section>
  );
}
