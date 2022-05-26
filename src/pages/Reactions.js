import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import List from "../components/List";
import { getTweetFavoriters } from "../services/favorite";
import { getRetweeters } from "../services/tweet";

export default function Reactions() {
  const { account_name, status_id, reaction_type } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reaction_type === "likes") {
      getTweetFavoriters(status_id, false)
        .then((res) => setData(res.data || []))
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else {
      getRetweeters(status_id, false)
        .then((res) => setData(res.data || []))
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [account_name, status_id, reaction_type]);

  return (
    <div>
      <Header
        title={reaction_type === "likes" ? "Liked By" : "Retweeted By"}
        backArrow
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
      ) : data.length > 0 ? (
        data.map((user) => (
          <List
            className="hover"
            key={user._id}
            data={{
              title: user.name,
              subtitle: user.account_name,
              image_url: user.profile_image_url,
              context: user.description,
            }}
            action={"/" + user.account_name}
          />
        ))
      ) : (
        <div className="text-center text-muted mt-5">
          No {reaction_type} yet
        </div>
      )}
    </div>
  );
}
