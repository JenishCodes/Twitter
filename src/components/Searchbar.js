import React, { useContext, useEffect, useState } from "react";
import List from "./List";
import {
  addSeachHistory,
  deleteSearchHistory,
  getSeachHistory,
} from "../services/user";
import { AuthContext } from "../config/context";
import { useNavigate } from "react-router-dom";

export default function Searchbar() {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getSeachHistory(user._id).then((res) => setList(res.data));
  }, [user._id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addSeachHistory(user._id, query)
      .then((res) => {
        const newList = list.filter((item) => item._id !== res.data._id);
        newList.unshift(res.data);
        
        setList(newList);
        
        navigate(
          query[0] === "#"
            ? "/search/hashtags?q="
            : query[0] === "@"
            ? "/search/users?q="
            : "/search/tweets?q=" + query
        );

        setQuery("");
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteHistory = (e, id) => {
    e.stopPropagation();
    deleteSearchHistory(id);
    const newList = list.filter((elem) => elem._id !== id);
    setList(newList);
  };

  const handleClearAll = () => {
    deleteSearchHistory(user._id, true);
    setList([]);
  };

  return (
    <div className="searchbar">
      <div className="rounded-pill bg-muted ps-2 pe-1 d-flex align-items-center">
        <i
          className="bi bi-search mx-2 px-1 fs-6 fw-light"
          placeholder="Search Twitter"
        ></i>
        <form onSubmit={handleSubmit} className="flex-grow-1">
          <input
            name="q"
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search Twitter"
            className="text-primary w-100"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            value={query}
            autoComplete="off"
          />
        </form>
        {query ? (
          <div className="btn hover rounded-circle py-1 px-2">
            <i
              className="bi bi-x-circle-fill text-muted"
              onClick={() => setQuery("")}
            ></i>
          </div>
        ) : null}
      </div>

      <div
        className={`auto-suggestions bg-muted position-relative ${
          focused ? "d-block" : "d-none"
        }`}
      >
        {loading ? (
          <div className="position-absolute rounded-3 my-1 text-center w-100">
            <div className="spinner-grow text-dark my-5 mx-auto" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : query ? (
          <div className="position-absolute rounded-3 my-1 w-100"></div>
        ) : (
          <div className="position-absolute bg-muted rounded-3 my-1 w-100">
            <div className="d-flex px-3 py-2 justify-content-between">
              <div className="fs-3">Recent</div>
              <div className="fs-6 btn hover" onClick={handleClearAll}>
                Clear All
              </div>
            </div>
            {list.length > 0 ? (
              list.map((elem, index) => (
                <List
                  className="hover pointer"
                  key={index}
                  data={{
                    ...elem,
                    image: elem.image_url ? null : elem.title.charAt(0) ===
                      "#" ? (
                      <div className="text-primary rounded-circle border py-1 px-2 me-3">
                        <i className="bi bi-hash fs-4"></i>
                      </div>
                    ) : (
                      <div className="text-primary rounded-circle border py-1 px-2 me-3">
                        <i className="bi bi-search fs-4"></i>
                      </div>
                    ),
                  }}
                  action={
                    elem.image_url
                      ? "/" + elem.title
                      : elem.title.charAt(0) === "#"
                      ? "/hashtag/" + elem.title.slice(1)
                      : "/search/tweets?q=" + elem.title
                  }
                  actionButton={
                    <div
                      className="btn hover px-2 py-1 rounded-circle"
                      onClick={(e) => handleDeleteHistory(e, elem._id)}
                    >
                      <i className="bi bi-x text-primary"></i>
                    </div>
                  }
                />
              ))
            ) : (
              <div className="text-center text-muted fw-bold mb-4 mt-2">
                No Search History
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
