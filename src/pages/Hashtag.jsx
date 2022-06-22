import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Tweet from "../components/Tweet";
import { AuthContext } from "../context";
import { getHashtagTweets } from "../services/hashtag";

export default function Hashtag() {
  const { hashtag } = useParams();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { scrollY } = useContext(AuthContext);

  const fetchTweets = () => {
    setLoading(true);
    getHashtagTweets(hashtag, tweets.length)
      .then((res) => {
        setTweets([...tweets, ...res.data]);
        setHasMore(res.hasMore);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (
      hasMore &&
      (scrollY + window.innerHeight >= document.body.offsetHeight ||
        tweets.length === 0)
    ) {
      fetchTweets();
    }
  }, [scrollY]);

  useEffect(() => {
    setHasMore(true);
    setTweets([]);
    window.scrollTo(0, 0);
    fetchTweets();
  }, [hashtag]);

  return (
    <div>
      <Helmet>
        <title>Tweets on {hashtag} / Twitter</title>
      </Helmet>
      <Header
        title={"#" + hashtag}
        subtitle={tweets?.length + " Tweets"}
        backArrow="full"
      />
      {tweets.length > 0
        ? tweets.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)
        : !loading && (
            <div className="text-center text-muted mt-5">No tweets yet</div>
          )}

      <Loading show={loading} className="my-5 text-app" />

      {tweets.length > 0 && <div className="h-25-vh"></div>}
    </div>
  );
}
