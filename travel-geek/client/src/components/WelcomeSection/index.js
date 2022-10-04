import React from "react";
import "./welcome-section.scss";

export function MainFrameBackground() {
  return (
    <div className="main-frame">
      <div className="main-bg-img">
        <header className="main-frame-header hide">Travel and expand your horizons</header>
        <div className="button-container">
          <a href="#" className="btn btn--intro"
             onClick={() => {
               console.log("click");
             }}>Discover our tours</a>
        </div>
      </div>
    </div>
  );
}
