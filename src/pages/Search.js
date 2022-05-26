import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Tweet from "../components/Tweet";
import List from "../components/List";
import Searchbar from "../components/Searchbar";
import Tabbar from "../components/Tabbar";
import Trend from "../components/Trend";
import { searchHashtags } from "../services/hashtag";
import { searchTweets } from "../services/tweet";
import { searchUser } from "../services/user";
import Header from "../components/Header";

export default function Search() {
  const [hashtags, setHashtags] = useState([]);
  const [users, setUsers] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [hashCursor, setHashCursor] = useState(0);
  const [userCursor, setUserCursor] = useState(0);
  const [tweetCursor, setTweetCursor] = useState(0);
  const [loading, setLoading] = useState(false);
  const { search_type } = useParams();
  const { search } = useLocation();
  const [query] = useState(new URLSearchParams(search).get("q"));

  const [tabs] = useState([
    {
      name: "Tweet",
      code: "tweets",
      url: "../search/tweets?q=" + query,
    },
    {
      name: "User",
      code: "users",
      url: "../search/users?q=" + query,
    },
    {
      name: "Hashtag",
      code: "hashtags",
      url: "../search/hashtags?q=" + query,
    },
  ]);

  useEffect(() => {
    if (search_type === "hashtags" && hashtags.length === 0) {
      searchHashtags(query, hashCursor)
        .then((res) => {
          setHashCursor(hashCursor + 1);
          setHashtags(res);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else if (search_type === "users" && users.length === 0) {
      searchUser(query, true, userCursor)
        .then((res) => {
          setUserCursor(userCursor + 1);
          setUsers(res);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else if (search_type === "tweets" && tweets.length === 0) {
      searchTweets(query, tweetCursor)
        .then((res) => {
          setTweetCursor(tweetCursor + 1);
          setTweets(res);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [search_type, query]);

  return (
    <div>
      <Tabbar activeTab={search_type} tabs={tabs} title="Search Results">
        {search_type === "tweets"
          ? tweets.length > 0
            ? tweets.map((tweet) => (
                <Tweet
                  key={tweet._id}
                  tweet={tweet}
                />
              ))
            : !loading && (
                <div className="text-center text-muted mt-3">
                  No tweets found
                </div>
              )
          : search_type === "users"
          ? users.length > 0
            ? users.map((user) => (
                <List
                  key={user.auth_id}
                  className="hover"
                  data={{
                    title: user.name,
                    subtitle: user.account_name,
                    image_url: user.profile_image_url,
                    context: user.description,
                  }}
                  action={"/" + user.account_name}
                />
              ))
            : !loading && (
                <div className="text-center text-muted mt-3">
                  No users found
                </div>
              )
          : search_type === "hashtags"
          ? hashtags.length > 0
            ? hashtags.map((hashtag) => (
                <Trend
                  key={hashtag.tag}
                  hashtag={hashtag.tag}
                  tweets={hashtag.tweet_count}
                />
              ))
            : !loading && (
                <div className="text-center text-muted mt-3">
                  No hashtags found
                </div>
              )
          : null}
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
        ) : null}
      </Tabbar>
    </div>
  );
}
