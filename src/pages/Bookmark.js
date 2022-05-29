import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
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
      <Header
        title="Bookmarks"
        arrow={false}
        subtitle={tweets.length + " Tweets"}
      />
      {loading ? (
        <div className="text-center my-5">
          <div
            className="spinner-border text-app"
            style={{ width: "1.5rem", height: "1.5rem" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : tweets.length > 0 ? (
        tweets.map((tweet, index) => <Tweet key={index} tweet={tweet} />)
      ) : (
        <div className="text-center text-muted mt-5">No bookmarks yet</div>
      )}
      {tweets.length > 0 ? <div className="h-50-vh"></div> : null}
    </div>
  );
}
