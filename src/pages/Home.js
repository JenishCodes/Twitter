import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { AuthContext } from "../config/context";
import { getUserFeed } from "../services/user";
import Tweet from "../components/Tweet";
import Loading from "../components/Loading";

export default function Home() {
  const [lastLikedTweet, setLastLikedTweet] = useState(0);
  const [lastMentionedTweet, setLastMentionedTweet] = useState(0);
  const [lastTweet, setLastTweet] = useState(0);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    getUserFeed(
      user.account_name,
      lastTweet,
      lastLikedTweet,
      lastMentionedTweet
    )
      .then((res) => {
        setFeed(res.data);
        setLastTweet(res.lastTweet);
        setLastMentionedTweet(res.lastMentionedTweet);
        setLastLikedTweet(res.lastLikedTweet);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="h-100">
      <Header title="Home" />
      <Loading
        show={loading}
        style={{ width: "1.5rem", height: "1.5rem" }}
        className="mt-5 text-app"
      />
      {feed.length > 0
        ? feed.map((tweet, index) =>
            tweet.referenced_tweet.length > 0 ? (
              <div key={index}>
                <Tweet lowerlink tweet={tweet.referenced_tweet[0]} />
                <Tweet upperlink tweet={tweet} />
              </div>
            ) : (
              <Tweet key={index} tweet={tweet} />
            )
          )
        : !loading && (
            <div className="text-center text-muted mt-5">No tweets yet</div>
          )}

      {feed.length ? <div className="h-50-vh"></div> : null}
    </div>
  );
}
