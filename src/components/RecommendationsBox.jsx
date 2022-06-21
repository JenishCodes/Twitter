import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromId, getUserRecommendations } from "../services/user";
import List from "./List";
import Loading from "./Loading";

export function RecommendationsBox() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getUserRecommendations()
      .then((res) => {
        setRecommendations(res);
        fetchNextBatch(res);
      })
      .catch((err) => console.log(err));
  }, []);

  const fetchNextBatch = (list) => {
    if (page >= data.length) {
      setLoading(true);
      Promise.all(
        list.slice(page, page + 3).map((l) =>
          getUserFromId(l)
            .then((user) => user)
            .catch((err) => console.log(err))
        )
      )
        .then((users) => {
          setPage(page + 3);
          setData([...data, ...users]);
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="py-3 px-4">
      <div className="bg-muted radius">
        <div className="py-1">
          <div className="fs-3 py-2 px-3 fw-bold">Who to follow</div>
        </div>
        {data.length > 0
          ? data.slice(0, page).map((user, index) => (
              <List
                key={index}
                className={`hover pointer ${
                  index === recommendations.length - 1 ? "mb-3" : ""
                }`}
                data={{
                  title: user.name,
                  subtitle: "@" + user.account_name,
                  image_url: user.profile_image_url,
                }}
                onClick={() => navigate(`/${user.account_name}`)}
              />
            ))
          : !loading && (
              <div className="text-center py-5 text-muted">
                No recommendations
              </div>
            )}
        {loading && (
          <Loading
            show={loading}
            className={`${page === 0 ? "my-5" : "my-2"} text-app`}
          />
        )}
        {data.length > 0 && !loading && (
          <div className="d-flex">
            {page > 3 && (
              <div
                className="btn hover pointer text-muted w-100 py-2"
                style={{
                  borderRadius: `0 0 ${
                    page >= recommendations.length ? "15px" : "0"
                  } 15px`,
                }}
                onClick={() => setPage(page - 3)}
              >
                Show less
              </div>
            )}
            {page < recommendations.length && (
              <div
                className="btn hover pointer text-muted w-100 py-2"
                style={{
                  borderRadius: `0 0 15px ${page <= 3 ? "15px" : "0"}`,
                }}
                onClick={() => {
                  setPage(page + 3);
                  fetchNextBatch(recommendations);
                }}
              >
                Show more
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
