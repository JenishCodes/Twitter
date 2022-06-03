import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Tweet from "../components/Tweet";
import List from "../components/List";
import Tabbar from "../components/Tabbar";
import Trend from "../components/Trend";
import { searchHashtags } from "../services/hashtag";
import { searchTweets } from "../services/tweet";
import { searchUser } from "../services/user";
import Loading from "../components/Loading";

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
  const [query, setQuery] = useState(search.replace("?q=", "").split("&")[0]);
  const navigate = useNavigate();

  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    setTabs([
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
  }, [query]);

  useEffect(() => {
    setLoading(true);
    const q = search.replace("?q=", "").split("&")[0];

    if (q !== query) {
      setHashCursor(0);
      setHashtags([]);
      setUserCursor(0);
      setUsers([]);
      setTweetCursor(0);
      setTweets([]);
      setQuery(q);
    }

    if (search_type === "hashtags" && (q !== query || hashCursor === 0)) {
      searchHashtags(q, 0, 10)
        .then((res) => {
          setHashCursor(1);
          setHashtags(res.data);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else if (search_type === "users" && (q !== query || userCursor === 0)) {
      searchUser(q, true, 0, 10)
        .then((res) => {
          setUserCursor(1);
          setUsers(res.data);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else if (search_type === "tweets" && (q !== query || tweetCursor === 0)) {
      searchTweets(q, 0, 10)
        .then((res) => {
          setTweetCursor(1);
          setTweets(res.data);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [search_type, search]);

  return (
    <div>
      <Tabbar activeTab={search_type} tabs={tabs} title="Search Results">
        <Loading
          show={loading}
          className="my-5 text-app"
          style={{ width: "1.5rem", height: "1.5rem" }}
        />
        {search_type === "tweets"
          ? tweets.length > 0
            ? tweets.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)
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
                  onClick={() => navigate("/" + user.account_name)}
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

        {(search_type === "tweets" && tweets.length > 0) ||
        (search_type === "users" && users.length > 0) ||
        (search_type === "hashtags" && hashtags.length > 0) ? (
          <div className="h-50-vh"></div>
        ) : null}
      </Tabbar>
    </div>
  );
}
