import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { AuthContext } from "../config/context";
import { getUserFeed } from "../services/user";
import Tweet from "../components/Tweet";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet-async";

export default function Home() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { user, scrollY } = useContext(AuthContext);

  useEffect(() => {
    if (
      hasMore &&
      (scrollY + window.innerHeight >= document.body.offsetHeight ||
        feed.length === 0)
    ) {
      setLoading(true);
      getUserFeed(user.account_name, feed.length)
        .then((res) => {
          setHasMore(res.hasMore);
          setFeed([...feed, ...res.data]);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [scrollY]);


  return (
    <div className="h-100">
      <Helmet>
        <title>Home / Twitter</title>
      </Helmet>
      <Header title="Home" />
      {feed.length > 0
        ? feed.map((tweet, index) => (
            <div key={index}>
              {tweet.referenced_tweet?.map((referencedTweet, i) => (
                <Tweet
                  key={index + "." + i}
                  tweet={referencedTweet}
                  upperlink={i !== 0}
                  lowerlink
                />
              ))}
              <Tweet upperlink={tweet.referenced_tweet} tweet={tweet} />
            </div>
          ))
        : !loading && (
            <div className="text-center text-muted mt-5">No tweets yet</div>
          )}

      <Loading
        show={loading}
        style={{ width: "1.5rem", height: "1.5rem" }}
        className="mt-5 text-app"
      />
      {feed.length ? <div className="h-50-vh"></div> : null}
    </div>
  );
}
