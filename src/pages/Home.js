import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { AuthContext } from "../config/context";
import { getUserFeed } from "../services/user";
import Tweet from "../components/Tweet";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet-async";

export default function Home() {
  const [cursor, setCursor] = useState(0);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    getUserFeed(user.account_name, cursor)
      .then((res) => {
        setFeed(res.data);
        setCursor(cursor + 1);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

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
