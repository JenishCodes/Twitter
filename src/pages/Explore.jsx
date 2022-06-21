import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import List from "../components/List";

export default function Explore() {
  const location = useLocation();
  const navigate = useNavigate();
  const [trends] = useState([
    {
      name: "LifeIsBetterThanTwitter",
      tweets: "1.5M",
    },
    {
      name: "StayHome",
      tweets: "1.2M",
    },
    {
      name: "MovieNight",
      tweets: "1.1M",
    },
    {
      name: "StaySafe",
      tweets: "1.0M",
    },
    {
      name: "Music",
      tweets: "900K",
    },
    {
      name: "Sports",
      tweets: "800K",
    },
    {
      name: "Entertainment",
      tweets: "700K",
    },
    {
      name: "Gaming",
      tweets: "600K",
    },
    {
      name: "News",
      tweets: "500K",
    },
    {
      name: "Politics",
      tweets: "400K",
    },
  ]);

  return (
    <div>
      {location.pathname === "/explore" && (
        <Helmet>
          <title>Explore / Twitter</title>
        </Helmet>
      )}

      <Header extraTitle="Trending" />

      <div>
        {trends.map((tag) => (
          <List
            key={tag.name}
            className="hover pointer"
            data={{
              title: tag.name,
              subtitle: tag.tweets + " Tweets",
              image: (
                <div className="rounded-circle border">
                  <i className="bi bi-hash fs-1 p-2"></i>
                </div>
              ),
            }}
            onClick={() => navigate(`/hashtag/${tag.name}`)}
          />
        ))}
      </div>

      <div className="h-50-vh"></div>
    </div>
  );
}
