import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { AuthContext } from "../context";
import { getUserFeed } from "../services/user";
import Tweet from "../components/Tweet";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet-async";

export default function Home() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { scrollY } = useContext(AuthContext);

  useEffect(() => {
    if (
      hasMore &&
      (scrollY + window.innerHeight >= document.body.offsetHeight - 300 ||
        feed.length === 0)
    ) {
      setLoading(true);
      getUserFeed(feed.length)
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
              {tweet.referenced_tweet?.map((referencedTweet, i) =>
                referencedTweet ? (
                  <Tweet
                    key={index + "." + i}
                    tweet={referencedTweet}
                    upperlink={i !== 0}
                    lowerlink
                  />
                ) : (
                  <div className="px-3 py-1">
                    <div
                      key={index + "." + i}
                      className="bg-muted text-muted p-3 radius"
                    >
                      This Tweet was deleted by the Tweet author.
                    </div>
                  </div>
                )
              )}
              <Tweet upperlink={tweet.referenced_tweet} tweet={tweet} />
            </div>
          ))
        : !loading && (
            <div className="text-center text-muted mt-5">No tweets yet</div>
          )}

      <Loading show={loading} className="mt-5 text-app" />

      {feed.length > 0 && <div className="h-25-vh"></div>}
    </div>
  );
}
