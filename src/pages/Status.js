import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Editor from "../components/Editor";
import {
  deleteTweet,
  getRetweeters,
  getTweetTimeline,
  postTweet,
} from "../services/tweet";
import { Link, useNavigate, useParams } from "react-router-dom";
import Tweet from "../components/Tweet";
import { AuthContext } from "../config/context";
import {
  getTweetFavoriters,
  makeFavorite,
  removeFavorite,
} from "../services/favorite";
import { parseTweet, timeFormatter } from "../utils";
import {
  bookmarkTweet,
  pinTweet,
  unbookmarkTweet,
  unpinTweet,
} from "../services/user";
import Loading from "../components/Loading";

export default function Status() {
  const { user } = useContext(AuthContext);
  const { account_name, status_id } = useParams();
  const [tweet, setTweet] = useState();
  const [show, setShow] = useState(false);
  const [references, setReferences] = useState();
  const [replies, setReplies] = useState();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);
  const [menuVisisble, setMenuVisisble] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const tweetRef = useRef();

  useEffect(() => {
    setLoading(true);
    getTweetTimeline(status_id)
      .then((res) => {
        setTweet(res.data);
        setReferences(res.includes.references);
        setReplies(res.includes.replies);
        window.scroll(0, tweetRef.current.scrollHeight);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));

    getTweetFavoriters(status_id, true)
      .then((res) => setLiked(res.data.includes(user._id)))
      .catch((err) => console.log(err));

    getRetweeters(status_id, true)
      .then((res) => setRetweeted(res.data.includes(user._id)))
      .catch((err) => console.log(err));

    setBookmarked(user.bookmarks.includes(status_id));
  }, [status_id, account_name, user]);

  const handleLike = (e) => {
    e.stopPropagation();
    if (liked) {
      setLiked(false);
      setTweet({
        ...tweet,
        public_metrics: {
          ...tweet.public_metrics,
          like_count: tweet.public_metrics.like_count - 1,
        },
      });
      removeFavorite(user._id, tweet._id);
    } else {
      setLiked(true);
      setTweet({
        ...tweet,
        public_metrics: {
          ...tweet.public_metrics,
          like_count: tweet.public_metrics.like_count + 1,
        },
      });
      makeFavorite(user._id, tweet._id);
    }
  };

  const handlePinTweet = (e) => {
    e.stopPropagation();
    if (user.pinned_tweet_id === tweet._id) {
      unpinTweet(user._id).catch((err) => console.log(err));
    } else {
      pinTweet(tweet._id, user._id).catch((err) => console.log(err));
    }
    setMenuVisisble(!menuVisisble);
  };

  const handleRetweet = (e) => {
    e.stopPropagation();
    if (retweeted) {
      setRetweeted(false);
      setRetweeted({
        ...tweet,
        public_metrics: {
          ...tweet.public_metrics,
          retweet_count: tweet.public_metrics.retweet_count - 1,
        },
      });

      deleteTweet(tweet._id, user._id);
    } else {
      setRetweeted(true);
      setRetweeted({
        ...tweet,
        public_metrics: {
          ...tweet.public_metrics,
          retweet_count: tweet.public_metrics.retweet_count + 1,
        },
      });
      postTweet(tweet.text, user._id, "retweet_of", [
        {
          id: tweet._id,
          type: "retweet_of",
        },
      ]);
    }
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (bookmarked) {
      unbookmarkTweet(user._id, status_id).catch((err) => console.log(err));
      setBookmarked(false);
    } else {
      bookmarkTweet(user._id, status_id).catch((err) => console.log(err));
      setBookmarked(true);
    }
  };

  const handleDelete = (e) => {
    deleteTweet(status_id)
      .then(() => navigate("/"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="h-100">
      <Header title="Tweet" backArrow="full" />

      <Loading
        show={loading}
        className="my-5 text-app"
        style={{ width: "1.5rem", height: "1.5rem" }}
      />

      <div className="reference-list" ref={tweetRef}>
        {references
          ? references.map((reference, index) =>
              reference ? (
                <Tweet
                  key={index}
                  tweet={reference}
                  upperlink={index !== 0}
                  lowerlink
                  reply_to={
                    index !== 0
                      ? references[index - 1].author.account_name
                      : null
                  }
                />
              ) : (
                <div className="px-3">
                  <div
                    key={index}
                    className="bg-muted text-muted p-3"
                    style={{ borderRadius: "1rem" }}
                  >
                    This Tweet was deleted by the Tweet author.
                  </div>
                </div>
              )
            )
          : null}
      </div>

      {tweet ? (
        <div>
          <div className="d-flex list px-3 pt-2">
            <div className="me-3 image">
              <img
                className="w-100 h-auto rounded-circle"
                src={tweet.author.profile_image_url}
                alt=""
              />
            </div>
            <div className="flex-grow-1">
              <div className="d-flex align-items-center position-relative">
                <div className="flex-grow-1">
                  <div
                    className="hover-underline fw-bold pointer d-inline-block"
                    onClick={() => navigate("/" + tweet.author.account_name)}
                  >
                    {tweet.author.name}
                  </div>
                  <div className="text-muted">@{tweet.author.account_name}</div>
                </div>
                <div className="actions">
                  <div
                    className="btn hover px-2 py-1 rounded-circle"
                    id="menu"
                    data-bs-toggle="dropdown"
                    data-title="More"
                    aria-expanded="false"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="bi bi-three-dots fs-3"></i>
                  </div>
                  <div
                    className="dropdown-menu dropdown-menu-end bg-primary py-0"
                    aria-labelledby="menu"
                  >
                    {account_name === user.account_name ? (
                      <div>
                        <div
                          className="d-flex align-items-center text-start text-primary py-2 px-3 hover btn"
                          onClick={handlePinTweet}
                        >
                          <i
                            className={`bi bi-pin-angle${
                              user.pinned_tweet_id === status_id ? "-fill" : ""
                            } me-3 fs-3`}
                          ></i>
                          <div>
                            {user.pinned_tweet_id === status_id
                              ? "Unpin Tweet"
                              : "Pin Tweet"}
                          </div>
                        </div>
                        <div
                          className="d-flex align-items-center text-start text-danger py-2 px-3 hover btn"
                          onClick={handleDelete}
                        >
                          <i className="bi bi-trash me-3 fs-3"></i>
                          <div>Delete</div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div
                          className="text-start text-primary d-flex align-items-center py-2 px-3 hover btn"
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
                        <div className="text-start text-primary d-flex align-items-center py-2 px-3 hover btn">
                          <i className="bi bi-flag me-3 fs-3"></i>
                          <div>Report Tweet</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-3">
            {tweet.text ? (
              <div
                className="fs-2 mt-2"
                dangerouslySetInnerHTML={{
                  __html: parseTweet(tweet.text, true),
                }}
              ></div>
            ) : null}
            {tweet.createdAt ? (
              <div className="text-muted mt-2 fs-5">
                {timeFormatter(tweet.createdAt, "Status")}
              </div>
            ) : null}
            <hr className="mt-3 mb-2" />
            {tweet.public_metrics ? (
              <div className="d-flex">
                <div className="me-3 text-muted">
                  <span className="text-primary fw-bold">
                    {tweet.public_metrics.reply_count + " "}
                  </span>
                  Replies
                </div>
                <div className="me-3 hover-underline">
                  <Link className="text-muted" to="retweets">
                    <span className="text-primary fw-bold">
                      {tweet.public_metrics.retweet_count + " "}
                    </span>
                    Retweets
                  </Link>
                </div>
                <div className="me-3 hover-underline">
                  <Link className="text-muted" to="likes">
                    <span className="text-primary fw-bold">
                      {tweet.public_metrics.like_count + " "}
                    </span>
                    Likes
                  </Link>
                </div>
              </div>
            ) : null}
            <hr className="mt-2 mb-1" />
            <div className="d-flex">
              <div className="flex-grow-1 text-center">
                <div
                  className="text-muted btn py-1 px-2 rounded-circle hover"
                  onClick={() => {
                    setShow(true);
                    document.body.style.overflowY = "hidden";
                  }}
                  data-title="Reply"
                >
                  <i className="bi fs-3 bi-arrow-return-left"></i>
                </div>
              </div>
              <div className="flex-grow-1 text-center">
                <div
                  onClick={handleRetweet}
                  className={`btn py-1 px-2 rounded-circle hover text-${
                    retweeted ? "success" : "muted"
                  }`}
                  data-title="Retweet"
                >
                  <i className="bi fs-3 bi-arrow-repeat "></i>
                </div>
              </div>
              <div className="flex-grow-1 text-center">
                <div
                  onClick={handleLike}
                  className={`btn py-1 px-2 rounded-circle hover text-${
                    liked ? "danger" : "muted"
                  }`}
                  data-title="Like"
                >
                  <i className={`bi fs-3 bi-heart${liked ? "-fill" : ""} `}></i>
                </div>
              </div>
              <div className="flex-grow-1 text-center">
                <div
                  className="text-muted btn py-1 px-2 hover rounded-circle"
                  data-title="Share"
                >
                  <i className="bi fs-3 bi-share"></i>
                </div>
              </div>
            </div>
          </div>
          <hr className="mb-0 mt-1" />
        </div>
      ) : null}

      <Editor
        show={show}
        setShow={setShow}
        referenced_tweets={tweet ? tweet.referenced_tweet : []}
        reference_tweet={tweet}
      />

      {replies
        ? replies.map((reply) => (
            <Tweet key={reply._id} tweet={reply} reply_to={account_name} />
          ))
        : null}

      <div className="h-50-vh"></div>
    </div>
  );
}
