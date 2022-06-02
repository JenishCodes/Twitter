import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  makeFavorite,
  removeFavorite,
  getTweetFavoriters,
} from "../services/favorite";
import { AuthContext } from "../config/context";

import { deleteTweet, getRetweeters, postTweet } from "../services/tweet";
import { parseTweet, timeFormatter } from "../utils";
import {
  bookmarkTweet,
  pinTweet,
  unbookmarkTweet,
  unpinTweet,
} from "../services/user";

export default function Tweet(props) {
  const { user, setUser } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [menuVisisble, setMenuVisisble] = useState(false);
  const [data, setData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setData(props.tweet);
    getTweetFavoriters(props.tweet._id, true).then((res) =>
      setLiked(res.data.includes(user._id))
    );
    getRetweeters(props.tweet._id, true).then((res) =>
      setRetweeted(res.data.includes(user._id))
    );

    setBookmarked(user.bookmarks.includes(props.tweet._id));
  }, [props.tweet, user]);

  const handlePinTweet = (e) => {
    e.stopPropagation();
    if (user.pinned_tweet_id === data._id) {
      unpinTweet(user._id).catch((err) => console.log(err));
      setUser({ ...user, pinned_tweet_id: "" });
    } else {
      pinTweet(data._id, user._id).catch((err) => console.log(err));
      setUser({ ...user, pinned_tweet_id: data._id });
    }
    setMenuVisisble(!menuVisisble);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (liked) {
      setLiked(false);
      setData({
        ...data,
        public_metrics: {
          ...data.public_metrics,
          like_count: data.public_metrics.like_count - 1,
        },
      });
      removeFavorite(user._id, data._id);
    } else {
      setLiked(true);
      setData({
        ...data,
        public_metrics: {
          ...data.public_metrics,
          like_count: data.public_metrics.like_count + 1,
        },
      });
      makeFavorite(user._id, data._id);
    }
  };

  const handleRetweet = (e) => {
    e.stopPropagation();
    if (retweeted) {
      setRetweeted(false);
      setData({
        ...data,
        public_metrics: {
          ...data.public_metrics,
          retweet_count: data.public_metrics.retweet_count - 1,
        },
      });

      deleteTweet(data._id, user._id);
    } else {
      setRetweeted(true);
      setData({
        ...data,
        public_metrics: {
          ...data.public_metrics,
          retweet_count: data.public_metrics.retweet_count + 1,
        },
      });
      postTweet(data.text, user._id, "retweet_of", [
        {
          type: "retweet_of",
          id: data._id,
        },
      ]);
    }
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (bookmarked) {
      unbookmarkTweet(data._id, user._id).catch((err) => console.log(err));
      setBookmarked(false);
    } else {
      bookmarkTweet(data._id, user._id).catch((err) => console.log(err));
      setBookmarked(true);
    }
  };

  return data ? (
    <div
      onClick={() =>
        navigate(`/${data.author.account_name}/status/${data._id}`)
      }
    >
      <div
        className={`tweet hover pointer border-0 px-3 ${props.upperlink ? "py-0" : "pt-2"
          } ${props.lowerlink ? "" : "border-bottom"} w-100 text-start`}
      >
        {props.upperlink ? (
          <div style={{ width: "48px", marginBottom: "6px" }}>
            <div
              style={{ height: "12px", width: "2px" }}
              className="border bg-secondary m-auto"
            ></div>
          </div>
        ) : null}

        {user.pinned_tweet_id === data._id ? (
          <div className="ms-5 fs-6 ps-3 text-muted fst-italic">
            <i className="bi bi-pin-angle-fill me-1"></i>
            <span>Pinned Tweet</span>
          </div>
        ) : null}

        {data.message ? (
          <div className="ms-5 fs-6 ps-3 text-muted fst-italic">
            {data.message}
          </div>
        ) : null}

        <div className="d-flex justify-content-between">
          {data.author.profile_image_url ? (
            <div className="d-flex flex-column align-items-center">
              <div className="profile-image">
                <img
                  className="w-100 h-auto rounded-circle"
                  src={data.author.profile_image_url}
                  alt=""
                />
              </div>
              {props.lowerlink ? (
                <div
                  style={{ marginTop: "6px" }}
                  className="flex-grow-1 border bg-secondary"
                ></div>
              ) : null}
            </div>
          ) : null}
          <div
            className={
              data.author.profile_image_url ? "details" : "details w-100"
            }
          >
            <div className="info d-flex align-items-center position-relative">
              <div className="d-flex flex-grow-1">
                <div
                  className="name me-1 fw-bold hover-underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/" + data.author.account_name);
                  }}
                >
                  {data.author.name}
                </div>
                <div className="username text-muted me-1">
                  @{data.author.account_name}
                </div>
                <div className="text-muted">
                  {" "}
                  · {timeFormatter(data.createdAt)}
                </div>
              </div>
              <div className="actions position-relative">
                <div
                  className="btn hover px-1 py-0 rounded-circle"
                  id="menu"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className="bi bi-three-dots"></i>
                </div>
                <div
                  className="dropdown-menu dropdown-menu-end bg-muted py-1"
                  aria-labelledby="menu"
                >
                  {data.author._id === user._id ? (
                    <div
                      className="d-flex text-start text-primary dropdown-item py-1 px-3 hover btn fs-6"
                      onClick={handlePinTweet}
                    >
                      <i
                        className={`bi bi-pin-angle${user.pinned_tweet_id === data._id ? "-fill" : ""
                          } me-3`}
                      ></i>
                      <div>
                        {user.pinned_tweet_id === data._id
                          ? "Unpin Tweet"
                          : "Pin Tweet"}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="text-start text-primary d-flex dropdown-item py-1 px-3 hover btn fs-6"
                      onClick={handleBookmark}
                    >
                      <i
                        className={`bi bi-bookmark${bookmarked ? "-fill" : ""
                          } me-3`}
                      ></i>
                      <div>
                        {bookmarked ? "Remove Bookmark" : "Add Bookmark"}
                      </div>
                    </div>
                  )}
                  {data.author._id === user._id ? (
                    <div className="text-start text-primary d-flex dropdown-item py-1 px-3 hover btn fs-6">
                      <i className="bi bi-flag me-3"></i>
                      <div>Report Tweet</div>
                    </div>
                  ) : (
                    <div className="d-flex text-start text-danger dropdown-item py-1 px-3 hover btn fs-6">
                      <i className="bi bi-trash me-3"></i>
                      <div>Delete</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className="tweet-text"
              dangerouslySetInnerHTML={{
                __html: data.text ? parseTweet(data.text, true) : null,
              }}
            ></div>

            <div className="mt-3 mb-2">
              <div className="d-flex">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center text-muted btn p-0">
                    <div className="me-2">
                      {data.public_metrics.reply_count}
                    </div>
                    <i className="bi rounded-circle hover px-2 py-1 fs-4 bi-arrow-return-left"></i>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <div
                    className={`d-flex align-items-center btn p-0 text-${retweeted ? "success" : "muted"
                      }`}
                    onClick={handleRetweet}
                  >
                    <div className="me-2">
                      {data.public_metrics.retweet_count}
                    </div>
                    <i className="bi rounded-circle hover px-2 py-1 fs-4 bi-arrow-repeat"></i>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <div
                    className={`d-flex h-100 align-items-center btn p-0 text-${liked ? "danger" : "muted"
                      }`}
                    onClick={handleLike}
                  >
                    <div className="me-2">{data.public_metrics.like_count}</div>
                    <i
                      className={`bi rounded-circle hover px-2 py-1 bi-heart${liked ? "-fill" : ""
                        } `}
                    ></i>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex h-100 align-items-center text-muted btn p-0">
                    <i className="bi rounded-circle hover px-2 py-1 bi-share"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
