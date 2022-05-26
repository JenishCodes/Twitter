import React from "react";
import Searchbar from "../components/Searchbar";
import Trend from "../components/Trend";

export default function Trending() {
  return (
    <div>
      <div className="position-sticky header p-2">
        <Searchbar />
        <div className="mt-2 py-1 fs-3 fw-bold px-2">Trending</div>
      </div>
      <div className="mb-5 pb-5">
        <Trend hashtag="Life" tweets={95} />
        <Trend hashtag="Problem" tweets={87} />
        <Trend hashtag="Happiness" tweets={85} />
        <Trend hashtag="Football" tweets={64} />
        <Trend hashtag="Cricket" tweets={62} />
        <Trend hashtag="Hostages" tweets={60} />
        <Trend hashtag="RRR" tweets={50} />
        <Trend hashtag="Movies" tweets={42} />
        <Trend hashtag="Music" tweets={40} />
      </div>
    </div>
  );
}
