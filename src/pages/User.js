import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Profile from "../components/Profile";
import Tabbar from "../components/Tabbar";
import Tweet from "../components/Tweet";
import { getUser, getUserTweets } from "../services/user";

export default function User() {
  const [user, setUser] = useState();
  const [tweets, setTweets] = useState([]);
  const [replies, setReplies] = useState([]);
  const [retweets, setRetweets] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [tweetCursor] = useState(0);
  const [replyCursor] = useState(0);
  const [retweetCursor] = useState(0);
  const [favoriteCursor] = useState(0);
  const [mentionCursor] = useState(0);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    getUser(account_name)
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [account_name]);

  useEffect(() => {
    if (!user) return null;

    setLoading(true);
    if (profile_type === "replies" && replies.length === 0) {
      getUserTweets(account_name, replyCursor, "replies")
        .then((res) => setReplies(res.data))
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else if (profile_type === "retweets" && retweets.length === 0) {
      getUserTweets(account_name, retweetCursor, "retweets")
        .then((res) => setRetweets(res.data))
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else if (profile_type === "likes" && favorites.length === 0) {
      getUserTweets(account_name, favoriteCursor, "likes")
        .then((res) => setFavorites(res.data))
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else if (profile_type === "mentions" && mentions.length === 0) {
      getUserTweets(account_name, mentionCursor, "mentions")
        .then((res) => setMentions(res.data))
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else if (profile_type === undefined && tweets.length === 0) {
      getUserTweets(account_name, tweetCursor, "")
        .then((res) => {
          const newTweets = [];

          res.data.forEach((tweet) => {
            if (tweet._id === user.pinned_tweet_id) {
              newTweets.unshift(tweet);
            } else {
              newTweets.push(tweet);
            }
          });

          setTweets(newTweets);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [
    profile_type,
    account_name,
    tweetCursor,
    replyCursor,
    retweetCursor,
    favoriteCursor,
    mentionCursor,
    user,
  ]);

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
                : !loading && (
                    <div className="text-center text-muted mt-5">
                      No Replies
                    </div>
                  )
              : profile_type === "retweets"
              ? retweets.length > 0
                ? retweets.map((retweet) => (
                    <Tweet key={retweet._id} tweet={retweet} />
                  ))
                : !loading && (
                    <div className="text-center text-muted mt-5">
                      No Retweets
                    </div>
                  )
              : profile_type === "likes"
              ? favorites.length > 0
                ? favorites.map((favorite) => (
                    <Tweet key={favorite._id} tweet={favorite} />
                  ))
                : !loading && (
                    <div className="text-center text-muted mt-5">No Likes</div>
                  )
              : profile_type === "mentions"
              ? mentions.length > 0
                ? mentions.map((mention) => (
                    <Tweet key={mention._id} tweet={mention} />
                  ))
                : !loading && (
                    <div className="text-center text-muted mt-5">
                      No Mentions
                    </div>
                  )
              : tweets.length > 0
              ? tweets.map((tweet) => (
                  <Tweet key={tweet._id} mode="tweet" tweet={tweet} />
                ))
              : !loading && (
                  <div className="text-center text-muted mt-5">No Tweets</div>
                )}
          </Tabbar>
        </div>
      ) : (
        !loading && (
          <div className="text-center text-muted mt-5">User not found</div>
        )
      )}

      <Loading
        show={loading}
        style={{ width: "1.5rem", height: "1.5rem" }}
        className="my-5 text-app"
      />

      {user ? <div className="h-50-vh"></div> : null}
    </div>
  );
}
