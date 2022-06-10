import React from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../components/Header";
import Trend from "../components/Trend";

export default function Explore() {
  const location = useLocation();
  return (
    <div>
      {location.pathname === "/explore" ? (
        <Helmet>
          <title>Explore / Twitter</title>
        </Helmet>
      ) : null}
      <Header extraTitle="Trending" />
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
      <div className="h-50-vh"></div>
    </div>
  );
}
