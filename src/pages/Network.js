import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Tabbar from "../components/Tabbar";
import { getFollowers, getFollowing } from "../services/friendship";
import List from "../components/List";
import { getUser } from "../services/user";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet";

export default function Network() {
  const { friendship_type, account_name } = useParams();
  const [followCursor, setFollowCursor] = useState(0);
  const [followingCursor, setFollowingCursor] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

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
    if (friendship_type === "following" && following.length === 0) {
      getFollowing(account_name, followCursor)
        .then((res) => {
          setFollowingCursor(followingCursor + 1);
          setFollowing(res.data || []);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else if (friendship_type === "followers" && followers.length === 0) {
      getFollowers(account_name, followingCursor)
        .then((res) => {
          setFollowCursor(followCursor + 1);
          setFollowers(res.data || []);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [friendship_type]);

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
        <Loading
          show={loading}
          style={{ width: "1.5rem", height: "1.5rem" }}
          className="mt-5 text-app"
        />
        {friendship_type === "following"
          ? following.length > 0
            ? following.map((friend) => (
                <List
                  className="hover pointer"
                  key={friend.account_name}
                  data={{
                    title: friend.name,
                    subtitle: friend.account_name,
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
                    subtitle: friend.account_name,
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

        {(friendship_type === "following" && following.length > 0) ||
        (friendship_type === "followers" && followers.length > 0) ? (
          <div className="h-50-vh"></div>
        ) : null}
      </Tabbar>
    </div>
  );
}
