import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Tweet from "../components/Tweet";
import { getHashtagTweets } from "../services/hashtag";

export default function Hashtag() {
  const { hashtag } = useParams();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHashtagTweets(hashtag)
      .then((res) => setTweets(res.data || []))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [hashtag]);

  return (
    <div>
      <Header
        title={"#" + hashtag}
        subtitle={tweets?.length + " Tweets"}
        backArrow="full"
      />

      <Loading
        show={loading}
        className="my-5 text-app"
        style={{ width: "1.5rem", height: "1.5rem" }}
      />

      {tweets.length > 0
        ? tweets.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)
        : !loading && (
            <div className="text-center text-muted mt-5">No tweets yet</div>
          )}

      {tweets.length > 0 ? <div className="h-50-vh"></div> : null}
    </div>
  );
}
