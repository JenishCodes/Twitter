import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Tweet from "../components/Tweet";
import { AuthContext } from "../config/context";
import { getBookmarkedTweets } from "../services/user";

export default function Bookmark() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getBookmarkedTweets(user._id)
      .then((res) => setTweets(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [user._id]);

  return (
    <div>
      <Helmet>
        <title>Bookmarks / Twitter</title>
      </Helmet>
      <Header
        title="Bookmarks"
        backArrow="half"
        subtitle={tweets.length + " Tweets"}
      />
      {tweets.length > 0
        ? tweets.map((tweet, index) => <Tweet key={index} tweet={tweet} />)
        : !loading && (
            <div className="text-center text-muted mt-5">No bookmarks yet</div>
          )}
      <Loading
        show={loading}
        className="my-5 text-app"
        style={{ width: "1.5rem", height: "1.5rem" }}
      />
      {tweets.length > 0 ? <div className="h-50-vh"></div> : null}
    </div>
  );
}
