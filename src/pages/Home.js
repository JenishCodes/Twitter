import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Editor from "../components/Editor";
import { AuthContext } from "../config/context";
import { getUserFeed } from "../services/user";
import Tweet from "../components/Tweet";

export default function Home() {
  const [lastLikedTweet, setLastLikedTweet] = useState(0);
  const [lastMentionedTweet, setLastMentionedTweet] = useState(0);
  const [lastTweet, setLastTweet] = useState(0);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
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
      <Header title="Home" arrow={false} />
      <Editor />
      <div className="feed">
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

        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
