import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Tweet from "../components/Tweet";
import List from "../components/List";
import Tabbar from "../components/Tabbar";
import { searchHashtags } from "../services/hashtag";
import { searchTweets } from "../services/tweet";
import { searchUser } from "../services/user";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet-async";

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
        path: "../search/tweets?q=" + query,
      },
      {
        name: "User",
        code: "users",
        path: "../search/users?q=" + query,
      },
      {
        name: "Hashtag",
        code: "hashtags",
        path: "../search/hashtags?q=" + query,
      },
    ]);
  }, [query]);

  useEffect(() => {
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
      setLoading(true);
      searchHashtags(q, 0, 10)
        .then((res) => {
          setHashCursor(1);
          setHashtags(res.data);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else if (search_type === "users" && (q !== query || userCursor === 0)) {
      setLoading(true);
      searchUser(q, true, 0, 10)
        .then((res) => {
          setUserCursor(1);
          setUsers(res.data);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else if (search_type === "tweets" && (q !== query || tweetCursor === 0)) {
      setLoading(true);
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
      <Helmet>
        <title>{query} - Search {search_type} / Twitter</title>
      </Helmet>
      <Tabbar
        activeTab={search_type}
        backArrow="full"
        tabs={tabs}
        title="Search Results"
      >
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
                  className="hover pointer"
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
                <List
                  key={hashtag.tag}
                  className="hover pointer"
                  data={{
                    title: hashtag.tag,
                    subtitle: hashtag.tweet_count + " Tweets",
                    image: (
                      <div className="rounded-circle border">
                        <i className="bi bi-hash fs-1 p-2"></i>
                      </div>
                    ),
                  }}
                  onClick={() => navigate("/hashtag/" + hashtag.tag)}
                />
              ))
            : !loading && (
                <div className="text-center text-muted mt-3">
                  No hashtags found
                </div>
              )
          : null}

        <Loading
          show={loading}
          className="my-5 text-app"
          style={{ width: "1.5rem", height: "1.5rem" }}
        />

        {(search_type === "tweets" && tweets.length > 0) ||
        (search_type === "users" && users.length > 0) ||
        (search_type === "hashtags" && hashtags.length > 0) ? (
          <div className="h-50-vh"></div>
        ) : null}
      </Tabbar>
    </div>
  );
}
