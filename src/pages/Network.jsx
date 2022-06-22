import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Tabbar from "../components/Tabbar";
import { getFollowers, getFollowing } from "../services/friendship";
import List from "../components/List";
import { getUser } from "../services/user";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../context";

export default function Network() {
  const { scrollY } = useContext(AuthContext);
  const { friendship_type, account_name } = useParams();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [hasMoreFollowers, setHasMoreFollowers] = useState(true);
  const [hasMoreFollowing, setHasMoreFollowing] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const helper = (func, data, setData, hasMore, setHasMore) => {
    if (
      hasMore &&
      (scrollY + window.innerHeight >= document.body.offsetHeight ||
        data.length === 0)
    )
      setLoading(true);
    func(account_name, data.length)
      .then((res) => {
        setHasMore(res.hasMore);
        setData([...data, ...res.data]);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) {
      if (location.state) {
        setUser(location.state);
      } else {
        getUser(account_name)
          .then((res) => setUser(res.data))
          .catch((err) => console.log(err));
      }
    }
  }, [account_name]);

  useEffect(() => {
    if (friendship_type === "following") {
      helper(
        getFollowing,
        following,
        setFollowing,
        hasMoreFollowing,
        setHasMoreFollowing
      );
    } else if (friendship_type === "followers") {
      helper(
        getFollowers,
        followers,
        setFollowers,
        hasMoreFollowers,
        setHasMoreFollowers
      );
    }
  }, [scrollY, friendship_type]);

  return (
    <div>
      <Helmet>
        <title>
          People
          {(friendship_type === "following" ? " following " : " followed by ") +
            user?.name +
            "(@" +
            account_name}
          ) / Twitter
        </title>
      </Helmet>
      <Tabbar
        backArrow="full"
        title={user ? user.name : "User"}
        subtitle={"@" + account_name}
        activeTab={friendship_type}
        tabs={[
          {
            name: "Following",
            path: "../network/following",
            code: "following",
          },
          {
            name: "Followers",
            path: "../network/followers",
            code: "followers",
          },
        ]}
      >
        {friendship_type === "following"
          ? following.length > 0
            ? following.map((friend) => (
                <List
                  className="hover pointer"
                  key={friend.account_name}
                  data={{
                    title: friend.name,
                    subtitle: "@" + friend.account_name,
                    image_url: friend.profile_image_url,
                    context: friend.description,
                  }}
                  onClick={() => navigate("/" + friend.account_name)}
                />
              ))
            : !loading && (
                <div className="text-center text-muted mt-5">No following</div>
              )
          : friendship_type === "followers"
          ? followers.length > 0
            ? followers.map((friend) => (
                <List
                  className="hover pointer"
                  key={friend.account_name}
                  data={{
                    title: friend.name,
                    subtitle: "@" + friend.account_name,
                    image_url: friend.profile_image_url,
                    context: friend.description,
                  }}
                  onClick={() => navigate("/" + friend.account_name)}
                />
              ))
            : !loading && (
                <div className="text-center text-muted mt-5">No followers</div>
              )
          : null}

        <Loading show={loading} className="mt-5 text-app" />

        {(friendship_type === "following" && following.length > 0) ||
          (friendship_type === "followers" && followers.length > 0 && (
            <div className="h-25-vh"></div>
          ))}
      </Tabbar>
    </div>
  );
}
