import React, { useContext, useEffect, useState } from "react";
import List from "./List";
import {
  addSeachHistory,
  deleteSearchHistory,
  getSeachHistory,
  searchUser,
} from "../services/user";
import { AuthContext } from "../config/context";
import { useNavigate } from "react-router-dom";
import { searchHashtags } from "../services/hashtag";

export default function Searchbar() {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getSeachHistory(user._id).then((res) => {
      const upadtedHistory = res.data.map((item) => ({
        ...item,
        type: "history",
      }));
      setHistory(upadtedHistory);
      setResults(upadtedHistory);
    });
  }, [user._id]);

  const handleAddHistory = (item, location) => {
    addSeachHistory(user._id, ...item)
      .then((res) => {
        const newList = history.filter((item) => item._id !== res.data._id);
        newList.unshift({ ...res.data, type: "history" });

        setHistory(newList);
        setResults(newList);

        navigate(location);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteHistory = (e, id) => {
    e.stopPropagation();
    deleteSearchHistory(id);
    const newList = history.filter((elem) => elem._id !== id);
    setResults(newList);
    setHistory(newList);
  };

  const handleClearAll = () => {
    deleteSearchHistory(user._id, true);
    setHistory([]);
    setResults([]);
  };

  const handleSearch = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery.length === 0) {
      setResults(history);
    } else if (searchQuery.length === 1) {
      setResults([]);
    } else {
      setLoading(true);
      if (searchQuery[0] === "#") {
        searchHashtags(searchQuery, 0, 6)
          .then((res) => {
            console.log(res.data);
            setResults(res.data.map((item) => ({ ...item, type: "hashtag" })));
          })
          .catch((err) => console.log(err))
          .finally(() => setLoading(false));
      } else if (searchQuery[0] === "@") {
        searchUser(searchQuery, true, 0, 6)
          .then((res) =>
            setResults(res.data.map((item) => ({ ...item, type: "user" })))
          )
          .catch((err) => console.log(err))
          .finally(() => setLoading(false));
      } else {
        searchUser(searchQuery, 0, 3)
          .then((res) => {
            const users = res.data.map((item) => ({ ...item, type: "user" }));

            searchHashtags(searchQuery, false, 0, 3)
              .then((res) =>
                setResults([
                  ...users,
                  ...res.data.map((item) => ({ ...item, type: "hashtag" })),
                ])
              )
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err))
          .finally(() => setLoading(false));
      }
    }
  };

  const handleClick = (result) => {
    var newHistory = [];
    var newLocation;

    if (result.type === "user") {
      newHistory = [result.name, result.account_name, result.profile_image_url];

      newLocation = `/${result.account_name}`;
    } else if (result.type === "hashtag") {
      newHistory = [result.tag, result.tweet_count];

      newLocation = `/hashtag/${result.tag}`;
    } else {
      if (result.image_url) {
        newHistory = [result.title, result.subtitle, result.image_url];

        newLocation = `/${result.subtitle}`;
      } else if (result.subtitle) {
        newHistory = [result.title, result.subtitle];

        newLocation = `/hashtag/${result.title}`;
      } else {
        newHistory = [result.title];

        newLocation = `/search/tweets?q=${result.title}`;
      }
    }

    handleAddHistory(newHistory, newLocation);

    setQuery("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchQuery = query.trim();

    if (searchQuery.length < 2) return;

    handleAddHistory(
      [searchQuery],
      searchQuery[0] === "#"
        ? `/hashtag/${searchQuery.substring(1)}`
        : searchQuery[0] === "@"
        ? `/${searchQuery.substring(1)}`
        : `/search/tweets?q=${searchQuery}`
    );

    setQuery("");
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
            onChange={handleSearch}
            type="text"
            placeholder="Search Twitter"
            className="text-primary w-100"
            onFocus={() => setFocused(true)}
            // onBlur={() => setFocused(false)}
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
        <div className="position-absolute bg-muted rounded-3 my-1 w-100">
          {loading ? (
            <div className="my-4 text-center">
              <div
                className="spinner-border text-app"
                style={{ width: "1.5rem", height: "1.5rem" }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="pb-2">
              <div className="d-flex px-3 py-2 justify-content-between">
                <div className="fs-3">{query ? "Results" : "Recent"}</div>
                {query ? null : (
                  <div className="fs-6 btn hover" onClick={handleClearAll}>
                    Clear All
                  </div>
                )}
              </div>
              {results.length > 0 ? (
                results.map((result, index) => (
                  <List
                    className="hover pointer"
                    key={index}
                    data={
                      result.type === "user"
                        ? {
                            image_url: result.profile_image_url,
                            title: result.name,
                            subtitle: result.account_name,
                          }
                        : result.type === "hashtag"
                        ? {
                            image: (
                              <div className="text-primary rounded-circle border px-2">
                                <i className="bi bi-hash fs-1"></i>
                              </div>
                            ),
                            title: result.tag,
                            subtitle: result.tweet_count + " Tweets",
                          }
                        : {
                            ...result,
                            image: !result.image_url ? (
                              result.subtitle ? (
                                <div className="text-primary rounded-circle border px-2">
                                  <i className="bi bi-hash fs-1"></i>
                                </div>
                              ) : (
                                <div className="text-primary rounded-circle border p-2">
                                  <i className="bi bi-search fs-3 mx-1"></i>
                                </div>
                              )
                            ) : null,
                          }
                    }
                    onClick={() => handleClick(result)}
                    actionButton={
                      <div
                        className="btn hover py-0 px-1 rounded-circle"
                        onClick={(e) => handleDeleteHistory(e, result._id)}
                      >
                        <i className="bi bi-x fs-3 text-primary"></i>
                      </div>
                    }
                  />
                ))
              ) : (
                <div className="text-center text-muted fw-bold mb-4 mt-2">
                  {query ? "No Search Results" : "No Search History"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
