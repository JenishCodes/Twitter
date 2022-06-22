import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Profile from "../components/Profile";
import Tabbar from "../components/Tabbar";
import Tweet from "../components/Tweet";
import { AuthContext } from "../context";
import { getUser, getUserTweets } from "../services/user";

export default function User() {
  const { scrollY } = useContext(AuthContext);
  const [user, setUser] = useState();
  const [tweets, setTweets] = useState([]);
  const [replies, setReplies] = useState([]);
  const [retweets, setRetweets] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [hasMoreTweets, setHasMoreTweets] = useState(true);
  const [hasMoreReplies, setHasMoreReplies] = useState(true);
  const [hasMoreRetweets, setHasMoreRetweets] = useState(true);
  const [hasMoreFavorites, setHasMoreFavorites] = useState(true);
  const [hasMoreMentions, setHasMoreMentions] = useState(true);
  const [loading, setLoading] = useState(true);
  const [tweetLoading, setTweetLoading] = useState(false);
  const { account_name, profile_type } = useParams();
  const [tabs] = useState([
    {
      name: "Tweets",
      path: `../`,
      code: undefined,
    },
    {
      name: "Replies",
      path: `../replies`,
      code: "replies",
    },
    {
      name: "Retweets",
      path: `../retweets`,
      code: "retweets",
    },
    {
      name: "Likes",
      path: `../likes`,
      code: "likes",
    },
    {
      name: "Mentions",
      path: `../mentions`,
      code: "mentions",
    },
  ]);

  const helper = (profile, data, setData, hasMore, setHasMore) => {
    if (
      hasMore &&
      (scrollY + window.innerHeight >= document.body.offsetHeight ||
        data.length === 0)
    ) {
      setTweetLoading(true);
      getUserTweets(user._id, data.length, profile)
        .then((res) => {
          setHasMore(res.hasMore);
          setData([...data, ...res.data]);
        })
        .catch((err) => console.log(err))
        .finally(() => setTweetLoading(false));
    }
  };

  useEffect(() => {
    setLoading(true);
    getUser(account_name)
      .then((res) => setUser(res))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [account_name]);

  useEffect(() => {
    if (!user) return null;

    if (profile_type === "replies") {
      helper(
        profile_type,
        replies,
        setReplies,
        hasMoreReplies,
        setHasMoreReplies
      );
    } else if (profile_type === "retweets") {
      helper(
        profile_type,
        retweets,
        setRetweets,
        hasMoreRetweets,
        setHasMoreRetweets
      );
    } else if (profile_type === "likes") {
      helper(
        profile_type,
        favorites,
        setFavorites,
        hasMoreFavorites,
        setHasMoreFavorites
      );
    } else if (profile_type === "mentions") {
      helper(
        profile_type,
        mentions,
        setMentions,
        hasMoreMentions,
        setHasMoreMentions
      );
    } else if (profile_type === undefined) {
      helper(profile_type, tweets, setTweets, hasMoreTweets, setHasMoreTweets);
    }
  }, [profile_type, scrollY, user]);

  return (
    <div>
      <Helmet>
        <title>
          {user
            ? user.name + " (@" + user.account_name + ") / Twitter"
            : "Profile / Twitter"}
        </title>
      </Helmet>
      <Header
        title={user ? user.name : "Profile"}
        backArrow="full"
        subtitle={
          profile_type === "replies"
            ? replies.length + " Replies"
            : profile_type === "retweets"
            ? retweets.length + " Retweets"
            : profile_type === "likes"
            ? favorites.length + " Likes"
            : profile_type === "mentions"
            ? mentions.length + " Mentions"
            : tweets.length + " Tweets"
        }
      />
      {user ? (
        <div>
          <Profile user={user} />
          <Tabbar activeTab={profile_type} tabs={tabs}>
            {profile_type === "replies"
              ? replies.length > 0
                ? replies.map((reply) => (
                    <Tweet key={reply._id} tweet={reply} />
                  ))
                : !tweetLoading && (
                    <div className="text-center text-muted mt-5">
                      No Replies
                    </div>
                  )
              : profile_type === "retweets"
              ? retweets.length > 0
                ? retweets.map((retweet) => (
                    <Tweet key={retweet._id} tweet={retweet} />
                  ))
                : !tweetLoading && (
                    <div className="text-center text-muted mt-5">
                      No Retweets
                    </div>
                  )
              : profile_type === "likes"
              ? favorites.length > 0
                ? favorites.map((favorite) => (
                    <Tweet key={favorite._id} tweet={favorite} />
                  ))
                : !tweetLoading && (
                    <div className="text-center text-muted mt-5">No Likes</div>
                  )
              : profile_type === "mentions"
              ? mentions.length > 0
                ? mentions.map((mention) => (
                    <Tweet key={mention._id} tweet={mention} />
                  ))
                : !tweetLoading && (
                    <div className="text-center text-muted mt-5">
                      No Mentions
                    </div>
                  )
              : tweets.length > 0
              ? tweets.map((tweet) => (
                  <Tweet key={tweet._id} tweet={tweet} showPinned />
                ))
              : !tweetLoading && (
                  <div className="text-center text-muted mt-5">No Tweets</div>
                )}

            <Loading show={tweetLoading} className="my-5 text-app" />
          </Tabbar>
        </div>
      ) : (
        !loading && (
          <div className="text-center text-muted mt-5">User not found</div>
        )
      )}
      <Loading show={loading} className="my-5 text-app" />
    </div>
  );
}
