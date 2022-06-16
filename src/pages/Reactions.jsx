import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import List from "../components/List";
import Loading from "../components/Loading";
import { getTweetFavoriters } from "../services/favorite";
import { getRetweeters } from "../services/tweet";

export default function Reactions() {
  const { account_name, status_id, reaction_type } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      hasMore &&
      (scrollY + window.innerHeight >= document.body.offsetHeight ||
        data.length === 0)
    ) {
      (reaction_type === "likes" ? getTweetFavoriters : getRetweeters)(
        status_id,
        data.length
      )
        .then((res) => {
          setHasMore(res.hasMore);
          setData([...data, ...res.data]);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [scrollY]);

  useEffect(() => {
    window.addEventListener("scroll", () => setScrollY(window.scrollY));
    return () =>
      window.removeEventListener("scroll", () => setScrollY(window.scrollY));
  }, []);

  return (
    <div>
      <Helmet>
        <title>
          {reaction_type === "likes" ? "Liked by" : "Retweeted by"} / Twitter
        </title>
      </Helmet>
      <Header
        title={reaction_type === "likes" ? "Liked by" : "Retweeted by"}
        backArrow="full"
      />

      {data.length > 0
        ? data.map((user) => (
            <List
              className="hover pointer"
              key={user._id}
              data={{
                title: user.name,
                subtitle: user.account_name,
                image_url: user.profile_image_url,
                context: user.description,
              }}
              onClick={() => navigate("/" + user.account_name)}
            />
          ))
        : !loading && (
            <div className="text-center text-muted mt-5">
              No {reaction_type} yet
            </div>
          )}

      <Loading
        show={loading}
        className="my-5 text-app"
        style={{ width: "1.5rem", height: "1.5rem" }}
      />

      {data.length > 0 ? <div className="h-50-vh"></div> : null}
    </div>
  );
}
