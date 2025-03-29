import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  makeFavorite,
  removeFavorite,
  isFavoriter,
} from "../services/favorite";
import { AuthContext } from "../context";
import {
  deleteTweet,
  isRetweeter,
  postTweet,
  updatePrivateMetrics,
} from "../services/tweet";
import { getTweetEntities, timeFormatter } from "../utils";
import { editProfile } from "../services/user";

export default function Tweet(props) {
  const { user, setUser, setToast } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [menuVisisble, setMenuVisisble] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [data, setData] = useState();
  const [textEntities, setTextEntities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.tweet.message?.split(" ")[0] === user.account_name) {
      if (props.tweet.message.includes("mentioned")) {
        setData({
          ...props.tweet,
          message: "You are mentioned",
        });
      } else {
        setData({
          ...props.tweet,
          message: "You " + props.tweet.message.split(" ").slice(1).join(" "),
        });
      }
    } else {
      setData(props.tweet);
    }

    setTextEntities(getTweetEntities(props.tweet.text));

    if (user.isAnonymous) return;

    setImageLoaded(user.settings?.autoLoadImages);

    isFavoriter(props.tweet._id).then((res) => setLiked(res));
    isRetweeter(props.tweet._id).then((res) => setRetweeted(res));

    setBookmarked(user.bookmarks.includes(props.tweet._id));
  }, [props.tweet, user]);

  const handlePinTweet = (e) => {
    e.stopPropagation();
    if (user.isAnonymous) {
      setToast({
        type: "app",
        message: "You must be logged in to pin tweet",
      });
      return;
    }

    if (user.pinned_tweet === data._id) {
      editProfile({ pinned_tweet: null }).catch((err) => console.log(err));
      setUser({ ...user, pinned_tweet: "" });
    } else {
      editProfile({ pinned_tweet: data._id }).catch((err) => console.log(err));
      setUser({ ...user, pinned_tweet: data._id });
    }
    setMenuVisisble(!menuVisisble);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    if (user.isAnonymous) {
      setToast({
        type: "app",
        message: "You must be logged in to like a tweet",
      });

      return;
    }
    if (liked) {
      setLiked(false);
      setData({
        ...data,
        public_metrics: {
          ...data.public_metrics,
          like_count: data.public_metrics.like_count - 1,
        },
      });
      removeFavorite(data._id);
    } else {
      setLiked(true);
      setData({
        ...data,
        public_metrics: {
          ...data.public_metrics,
          like_count: data.public_metrics.like_count + 1,
        },
      });
      makeFavorite(data._id);
    }
  };

  const handleRetweet = (e) => {
    e.stopPropagation();
    if (user.isAnonymous) {
      setToast({
        message: "You must be logged in to retweet",
        type: "app",
      });
      return;
    }
    if (retweeted) {
      setRetweeted(false);
      setData({
        ...data,
        public_metrics: {
          ...data.public_metrics,
          retweet_count: data.public_metrics.retweet_count - 1,
        },
      });

      deleteTweet(data._id, true);
    } else {
      setRetweeted(true);
      setData({
        ...data,
        public_metrics: {
          ...data.public_metrics,
          retweet_count: data.public_metrics.retweet_count + 1,
        },
      });
      postTweet({
        text: data.text,
        author: user._id,
        referenced_tweet: [
          {
            type: "retweet_of",
            id: data._id,
          },
        ],
      });
    }
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (user.isAnonymous) {
      setToast({
        message: "You must be logged in to bookmark tweets",
        type: "app",
      });
      return;
    }
    if (bookmarked) {
      editProfile({ $pull: { bookmarks: data._id } }).catch((err) =>
        console.log(err)
      );
      setUser({
        ...user,
        bookmarks: user.bookmarks.filter((bookmark) => bookmark !== data._id),
      });
      setBookmarked(false);
    } else {
      editProfile({ $push: { bookmarks: data._id } }).catch((err) =>
        console.log(err)
      );
      setUser({ ...user, bookmarks: [...user.bookmarks, data._id] });
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
        className={`tweet hover pointer border-0 px-3${
          props.upperlink ? " py-0" : " pt-2"
        }${props.lowerlink ? "" : " border-bottom"} w-100 text-start`}
      >
        {props.upperlink && <div className="border tweet-upperlink"></div>}

        {user.pinned_tweet === data._id && props.showPinned && (
          <div className="ms-5 fs-6 ps-3 text-muted fst-italic">
            <i className="bi bi-pin-angle-fill me-1"></i>
            <span>Pinned Tweet</span>
          </div>
        )}

        {data.message && (
          <div className="ms-5 fs-6 ps-3 text-muted fst-italic">
            {data.message}
          </div>
        )}

        <div className="d-flex justify-content-between">
          {data.author.profile_image_url && (
            <div className="d-flex flex-column align-items-center">
              <div className="profile-image">
                <img
                  className="w-100 h-auto rounded-circle square"
                  src={data.author.profile_image_url}
                  alt=""
                />
              </div>
              {props.lowerlink && (
                <div className="border tweet-lowerlink h-100"></div>
              )}
            </div>
          )}
          <div
            className={
              data.author.profile_image_url ? "details" : "details w-100"
            }
          >
            <div className="info d-flex align-items-center position-relative">
              <div className="d-flex flex-grow-1 flex-wrap">
                <div
                  className="name me-1 fw-bold hover-underline oneline"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (data.author.account_name !== user.account_name) {
                      updatePrivateMetrics(data._id, {
                        $inc: { "private_metrics.profile_visits": 1 },
                      });
                    }
                    navigate(`/${data.author.account_name}`);
                  }}
                >
                  {data.author.name}
                </div>
                <div className="d-flex">
                  <div className="username text-muted me-1 oneline">
                    @{data.author.account_name}
                  </div>
                  <div className="text-muted">
                    {" "}
                    · {timeFormatter(data.createdAt, "Tweet")}
                  </div>
                </div>
              </div>
              <div className="actions">
                <div
                  className="btn hover px-1 py-0 rounded-circle"
                  id="tweet-menu"
                  data-bs-toggle="dropdown"
                  data-title="More"
                  aria-expanded="false"
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className="bi bi-three-dots"></i>
                </div>
                <div
                  className="dropdown-menu dropdown-menu-end bg-primary py-0"
                  aria-labelledby="tweet-menu"
                >
                  {!user.isAnonymous && data.author._id === user._id ? (
                    props.tweet.referenced_tweet?.length === 0 && (
                      <div
                        className="d-flex align-items-center text-primary dropdown-item py-2 px-3 hover btn"
                        onClick={handlePinTweet}
                      >
                        <i
                          className={`bi bi-pin-angle${
                            user.pinned_tweet === data._id ? "-fill" : ""
                          } me-3 fs-3`}
                        ></i>
                        <div>
                          {user.pinned_tweet === data._id
                            ? "Unpin Tweet"
                            : "Pin Tweet"}
                        </div>
                      </div>
                    )
                  ) : (
                    <div
                      className="d-flex align-items-center text-primary dropdown-item py-2 px-3 hover btn"
                      onClick={handleBookmark}
                    >
                      <i
                        className={`bi bi-bookmark${
                          bookmarked ? "-fill" : ""
                        } me-3 fs-3`}
                      ></i>
                      <div>
                        {bookmarked ? "Remove Bookmark" : "Add Bookmark"}
                      </div>
                    </div>
                  )}
                  {!user.isAnonymous && data.author._id === user._id ? (
                    <div
                      className="d-flex text-danger align-items-center dropdown-item py-2 px-3 hover btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTweet(data._id);
                        setData(null);
                      }}
                    >
                      <i className="bi bi-trash me-3 fs-3"></i>
                      <div>Delete</div>
                    </div>
                  ) : (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setToast({
                          message: "This functionality is not yet build.",
                          type: "info",
                        });
                      }}
                      className="d-flex align-items-center text-primary dropdown-item py-2 px-3 hover btn"
                    >
                      <i className="bi bi-flag me-3 fs-3"></i>
                      <div>Report Tweet</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="tweet-text">
              {textEntities.map((entity, index) =>
                entity.type !== "normal" ? (
                  <span
                    key={index}
                    className="text-app pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(entity.url);
                    }}
                  >
                    {entity.content}
                  </span>
                ) : (
                  <span className="white-space-pre-line" key={index}>
                    {entity.content}
                  </span>
                )
              )}
            </div>

            {data.media && (
              <div className="media mb-2 mt-3 bg-muted rounded-3">
                {imageLoaded ? (
                  <img
                    className="w-100 h-auto rounded-3"
                    src={imageLoaded && data.media}
                    alt=""
                  />
                ) : (
                  <div className="w-100 text-center py-5">
                    <div
                      className="btn rounded-pill hover bg-primary text-muted fs-7 py-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageLoaded(true);
                      }}
                    >
                      Load Image
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="mt-3 mb-2">
              <div className="d-flex">
                <div className="col-3">
                  <div
                    className="d-flex w-min align-items-center text-muted btn p-0"
                    data-title="Reply"
                  >
                    <div className="me-2">
                      {data.public_metrics.reply_count}
                    </div>
                    <i className="bi rounded-circle hover px-2 py-1 fs-4 bi-arrow-return-left"></i>
                  </div>
                </div>
                <div className="col-3">
                  <div
                    className={`d-flex w-min align-items-center btn p-0 text-${
                      retweeted ? "success" : "muted"
                    }`}
                    data-title="Retweet"
                    onClick={handleRetweet}
                  >
                    <div className="me-2">
                      {data.public_metrics.retweet_count}
                    </div>
                    <i className="bi rounded-circle hover px-2 py-1 fs-4 bi-arrow-repeat"></i>
                  </div>
                </div>
                <div className="col-3">
                  <div
                    className={`d-flex w-min h-100 align-items-center btn p-0 text-${
                      liked ? "danger" : "muted"
                    }`}
                    data-title="Like"
                    onClick={handleLike}
                  >
                    <div className="me-2">{data.public_metrics.like_count}</div>
                    <i
                      className={`bi rounded-circle hover px-2 py-1 bi-heart${
                        liked ? "-fill" : ""
                      } `}
                    ></i>
                  </div>
                </div>
                <div className="col-3">
                  <div
                    className="d-flex w-min h-100 align-items-center text-muted btn p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(window.location.toString());
                      setToast({
                        message: "Tweet link copied to clipboard.",
                        type: "app",
                      });
                    }}
                    data-title="Share"
                  >
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
