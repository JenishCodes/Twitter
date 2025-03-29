import React, { useContext, useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import Editor from "../components/Editor";
import {
  deleteTweet,
  getTweet,
  getTweetReferences,
  getTweetReplies,
  isRetweeter,
  postTweet,
  updatePrivateMetrics,
} from "../services/tweet";
import { Link, useNavigate, useParams } from "react-router-dom";
import Tweet from "../components/Tweet";
import { AuthContext } from "../context";
import {
  isFavoriter,
  makeFavorite,
  removeFavorite,
} from "../services/favorite";
import { getTweetEntities, timeFormatter } from "../utils";
import { editProfile } from "../services/user";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import { Helmet } from "react-helmet-async";
import { getRelationship } from "../services/friendship";

export default function Status() {
  const { user, setUser, setToast } = useContext(AuthContext);
  const { account_name, status_id } = useParams();
  const [tweet, setTweet] = useState();
  const [textEntities, setTextEntities] = useState([]);
  const [show, setShow] = useState(false);
  const [mediaModalShow, setMediaModalShow] = useState(false);
  const [analyticsModalShow, setAnalyticsModalShow] = useState(false);
  const [references, setReferences] = useState([]);
  const [replies, setReplies] = useState([]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);
  const [hasMoreReplies, setHasMoreReplies] = useState(true);
  const [relation, setRelation] = useState("strangers");
  const [loading, setLoading] = useState(true);
  const [refLoading, setRefLoading] = useState(false);
  const [loadedRefs, setLoadedRefs] = useState(false);
  const navigate = useNavigate();
  const referencesRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setTweet(null);
    setReferences([]);
    setReplies([]);
    setLiked(false);
    setBookmarked(false);
    setRetweeted(false);
    setHasMoreReplies(true);
    setRelation("strangers");
    setLoadedRefs(false);

    getTweet(status_id)
      .then((res) => {
        setTweet(res);

        if (res.referenced_tweet.length === 0) {
          setLoadedRefs(true);
        } else {
          window.scrollTo(0, 2);
        }

        setTextEntities(getTweetEntities(res.text));

        if (res.author._id !== user._id) {
          updatePrivateMetrics(status_id, {
            $inc: { "private_metrics.detail_expands": 1 },
          });
        }

        if (user.isAnonymous) return;

        isFavoriter(status_id)
          .then((res) => setLiked(res))
          .catch((err) => console.log(err));

        isRetweeter(status_id)
          .then((res) => setRetweeted(res))
          .catch((err) => console.log(err));

        setBookmarked(user.bookmarks.includes(status_id));

        getRelationship(user._id, res.author._id)
          .then((res) => setRelation(res.relation))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setRefLoading(true);
        getTweetReferences(status_id)
          .then((res) => setReferences(res))
          .catch((err) => console.log(err))
          .finally(() => {
            setRefLoading(false);
            setLoadedRefs(true);
            window.scroll(0, referencesRef.current.scrollHeight);
          });
      });

    handleLoadMore(true);
  }, [status_id]);

  const handleLike = (e) => {
    e.stopPropagation();
    if (user.isAnonymous) {
      setToast({
        type: "app",
        message: "You must be logged in to like a tweet.",
      });
      return;
    }

    if (liked) {
      setLiked(false);
      setTweet({
        ...tweet,
        public_metrics: {
          ...tweet.public_metrics,
          like_count: tweet.public_metrics.like_count - 1,
        },
      });
      removeFavorite(tweet._id);
    } else {
      setLiked(true);
      setTweet({
        ...tweet,
        public_metrics: {
          ...tweet.public_metrics,
          like_count: tweet.public_metrics.like_count + 1,
        },
      });
      makeFavorite(tweet._id);
    }
  };

  const handlePinTweet = () => {
    if (user.isAnonymous) {
      setToast({
        message: "You must be logged in to pin tweet",
        type: "app",
      });
      return;
    }
    if (user.pinned_tweet === tweet._id) {
      editProfile({ pinned_tweet: null }).catch((err) => console.log(err));
      setUser({ ...user, pinned_tweet: "" });
    } else {
      editProfile({ pinned_tweet: tweet._id }).catch((err) => console.log(err));
      setUser({ ...user, pinned_tweet: tweet._id });
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
      setTweet({
        ...tweet,
        public_metrics: {
          ...tweet.public_metrics,
          retweet_count: tweet.public_metrics.retweet_count - 1,
        },
      });

      deleteTweet(tweet._id, true);
    } else {
      setRetweeted(true);
      setTweet({
        ...tweet,
        public_metrics: {
          ...tweet.public_metrics,
          retweet_count: tweet.public_metrics.retweet_count + 1,
        },
      });
      postTweet({
        text: tweet.text,
        author: user._id,
        referenced_tweet: [
          {
            id: tweet._id,
            type: "retweet_of",
          },
        ],
      });
    }
  };

  const handleBookmark = () => {
    if (user.isAnonymous) {
      setToast({
        message: "You must be logged in to bookmark tweets",
        type: "app",
      });
      return;
    }
    if (bookmarked) {
      editProfile({ $pull: { bookmarks: status_id } }).catch((err) =>
        console.log(err)
      );
      setUser({
        ...user,
        bookmarks: user.bookmarks.filter((bookmark) => bookmark !== status_id),
      });
      setBookmarked(false);
    } else {
      editProfile({ $push: { bookmarks: status_id } }).catch((err) =>
        console.log(err)
      );
      setUser({ ...user, bookmarks: [...user.bookmarks, status_id] });
      setBookmarked(true);
    }
  };

  const handleDelete = () => {
    deleteTweet(status_id)
      .then(() => navigate("/"))
      .catch((err) => console.log(err));
  };

  const handleLoadMore = (newTweet = false) => {
    setLoading(true);
    getTweetReplies(status_id, replies.length)
      .then((res) => {
        if (newTweet) {
          setReplies(res.data);
        } else {
          setReplies([...replies, ...res.data]);
        }
        setHasMoreReplies(res.hasMore);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="h-100 status">
      <Helmet>
        <title>
          {tweet
            ? tweet.author.account_name +
              " on Twitter: " +
              '"' +
              (references.length > 0
                ? "@" +
                  references[references.length - 1]?.author.account_name +
                  " "
                : "") +
              tweet.text +
              '" / Twitter'
            : "Status / Twitter"}
        </title>
      </Helmet>
      <Header title="Tweet" backArrow="full" />

      {mediaModalShow ? (
        <Modal className="w-100 h-100">
          <div className="position-absolute p-3">
            <div
              className="btn hover px-2 py-0 rounded-circle"
              onClick={() => {
                setMediaModalShow(false);
                document.body.style.overflowY = "scroll";
              }}
            >
              <i className="bi bi-x fs-1"></i>
            </div>
          </div>
          <div className="d-flex flex-column align-items-center h-100 justify-content-center">
            <div className="w-100 media-model-image">
              <img
                className="h-100 w-100"
                src={tweet.media}
                alt="Tweet media"
              />
            </div>
          </div>
        </Modal>
      ) : null}

      {analyticsModalShow ? (
        <Modal className="h-100 w-100">
          <div className="compose bg-primary w-100 h-100 overflow-y-auto">
            <div className="w-100 position-sticky top-0 p-2">
              <div className="d-flex align-items-center">
                <div
                  className="btn hover rounded-circle px-2 py-0"
                  onClick={() => {
                    setAnalyticsModalShow(false);
                    document.body.style.overflowY = "scroll";
                  }}
                >
                  <i className="bi bi-x fs-1"></i>
                </div>
                <div className="fs-3 fw-bold ms-3">Tweet Analytics</div>
              </div>
            </div>
            <div className="px-3 py-2">
              <div className="border p-2 radius">
                <div className="d-flex mx-1 mt-1">
                  <img
                    className="rounded-circle small-profile-image"
                    src={user.profile_image_url}
                    alt="Profile"
                  />
                  <div className="fw-bold mx-1">{user.name}</div>
                  <div className="text-muted">{user.account_name}</div>
                  <div className="mx-1 text-muted">·</div>
                  <div className="text-muted">
                    {timeFormatter(tweet.createdAt, "Tweet")}
                  </div>
                </div>
                <div className="m-1">{tweet.text}</div>
              </div>
            </div>
            <div className="px-3 py-2">
              <div className="border p-3 radius">
                <div className="d-flex justify-content-around">
                  <div className="text-center">
                    <i className="bi bi-heart fs-3 text-muted"></i>
                    <div className="fw-bold">
                      {tweet.public_metrics.like_count}
                    </div>
                  </div>
                  <div className="text-center">
                    <i className="bi bi-arrow-repeat fs-3 text-muted"></i>
                    <div className="fw-bold">
                      {tweet.public_metrics.retweet_count}
                    </div>
                  </div>
                  <div className="text-center">
                    <i className="bi bi-arrow-return-left fs-3 text-muted"></i>
                    <div className="fw-bold">
                      {tweet.public_metrics.reply_count}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-3 py-2">
              <div className="d-flex justify-content-around">
                <div className="text-center">
                  <div className="text-muted">Profile Visits</div>
                  <div className="fw-bold fs-1">
                    {tweet.private_metrics.profile_visits}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-muted">Detail Expands</div>
                  <div className="fw-bold fs-1">
                    {tweet.private_metrics.detail_expands}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      ) : null}

      <div ref={referencesRef} className="reference-list">
        {references?.map((reference, index) =>
          reference ? (
            <Tweet
              key={index}
              tweet={reference}
              upperlink={index !== 0}
              lowerlink
              reply_to={
                index !== 0 ? references[index - 1].author.account_name : null
              }
            />
          ) : (
            <div className="px-3 py-2">
              <div key={index} className="bg-muted text-muted p-3 radius">
                This Tweet was deleted by the Tweet author.
              </div>
            </div>
          )
        )}
      </div>

      <Loading
        className="text-app"
        show={refLoading && !loadedRefs}
        size="medium"
      />

      {tweet && !refLoading && (!loadedRefs || references.length > 0) && (
        <div className="border status-upperlink"></div>
      )}

      {tweet ? (
        <div className="status">
          <div className="d-flex list px-3 pt-1">
            <div className="me-3 image">
              <img
                className="w-100 h-auto rounded-circle square"
                src={tweet.author.profile_image_url}
                alt=""
              />
            </div>
            <div className="flex-grow-1">
              <div className="d-flex align-items-center position-relative">
                <div className="flex-grow-1">
                  <div
                    className="hover-underline fw-bold pointer d-inline-block"
                    onClick={() => {
                      if (
                        !user.isAnonymous &&
                        tweet.author.account_name !== user.account_name
                      ) {
                        updatePrivateMetrics(tweet._id, {
                          $inc: { "private_metrics.profile_visits": 1 },
                        });
                      }
                      navigate("/" + tweet.author.account_name);
                    }}
                  >
                    {tweet.author.name}
                  </div>
                  <div className="text-muted">@{tweet.author.account_name}</div>
                </div>
                <div className="actions">
                  <div
                    className="btn hover px-2 py-1 rounded-circle"
                    id="status-menu"
                    data-bs-toggle="dropdown"
                    data-title="More"
                    aria-expanded="false"
                  >
                    <i className="bi bi-three-dots fs-3"></i>
                  </div>
                  <div
                    className="dropdown-menu dropdown-menu-end bg-primary py-0"
                    aria-labelledby="status-menu"
                  >
                    {!user.isAnonymous && account_name === user.account_name ? (
                      <div>
                        {tweet.referenced_tweet.length === 0 && (
                          <div
                            className="d-flex align-items-center text-start text-primary py-2 px-3 hover btn"
                            onClick={handlePinTweet}
                          >
                            <i
                              className={`bi bi-pin-angle${
                                user.pinned_tweet === status_id ? "-fill" : ""
                              } me-3 fs-3`}
                            ></i>
                            <div>
                              {user.pinned_tweet === status_id
                                ? "Unpin Tweet"
                                : "Pin Tweet"}
                            </div>
                          </div>
                        )}
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
                        <div
                          onClick={() =>
                            setToast({
                              message: "This functionality is not yet build.",
                              type: "app",
                            })
                          }
                          className="text-start text-primary d-flex align-items-center py-2 px-3 hover btn"
                        >
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
          {references.length > 0 && (
            <div className="px-3 pt-2 my-1 text-muted">
              Replying to{" "}
              {references[references.length - 1] && (
                <Link
                  className="hover-underline text-app"
                  to={
                    "/" + references[references.length - 1].author.account_name
                  }
                >
                  @{references[references.length - 1].author.account_name}
                </Link>
              )}
            </div>
          )}
          <div className="px-3">
            {tweet.text && (
              <div className="fs-2 mt-2">
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
            )}
            {tweet.media && (
              <div className="media my-2">
                <div className="media-body">
                  <img
                    className="w-100 h-auto pointer rounded-3"
                    src={tweet.media}
                    onClick={() => {
                      document.body.style.overflowY = "hidden";
                      setMediaModalShow(true);
                    }}
                    alt=""
                  />
                </div>
              </div>
            )}
            {tweet.createdAt && (
              <div className="text-muted mt-2 fs-5">
                {timeFormatter(tweet.createdAt, "Status")}
              </div>
            )}
            <hr className="mt-3 mb-2" />

            {tweet.public_metrics && (
              <div className="d-flex p-1">
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
            )}
            <hr className="mt-2 mb-1" />
            <div className="d-flex">
              <div className="flex-grow-1 text-center">
                <div
                  className={`text-muted btn py-1 px-2 rounded-circle hover ${
                    tweet.reply_settings === "nobody" ||
                    (tweet.reply_settings === "followings" &&
                      (relation === "strangers" || relation === "follower"))
                      ? "disabled"
                      : ""
                  }
                    `}
                  onClick={() => {
                    if (user.isAnonymous) {
                      setToast({
                        message: "You must be logged in to reply.",
                        type: "app",
                      });
                      return;
                    }
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
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(
                      `${window.location.origin}/tweet/${tweet._id}`
                    );
                    setToast({
                      message: "Tweet link copied to clipboard.",
                      type: "app",
                    });
                  }}
                  data-title="Share"
                >
                  <i className="bi fs-3 bi-share"></i>
                </div>
              </div>
              {!user.isAnonymous && account_name === user.account_name && (
                <div className="flex-grow-1 text-center">
                  <div
                    onClick={() => {
                      setAnalyticsModalShow(true);
                      document.body.style.overflowY = "hidden";
                    }}
                    className="text-muted btn py-1 px-2 hover rounded-circle"
                    data-title="Analytics"
                  >
                    <i className="bi fs-3 bi-clipboard2-data"></i>
                  </div>
                </div>
              )}
            </div>
          </div>
          <hr className="mb-0 mt-1" />
        </div>
      ) : null}

      <Editor
        show={show}
        setShow={setShow}
        referenced_tweet={tweet ? tweet.referenced_tweet : []}
        reference_tweet={tweet}
      />

      <div className="replies">
        {replies.length > 0
          ? replies.map((reply) => (
              <Tweet key={reply._id} tweet={reply} reply_to={account_name} />
            ))
          : !loading && (
              <div className="text-muted mt-5 text-center">No replies yet</div>
            )}

        {loading ? (
          <Loading show className="my-5 text-app" />
        ) : (
          hasMoreReplies && (
            <div className="d-flex justify-content-center">
              <div
                className="btn hover rounded-circle mt-3"
                onClick={handleLoadMore}
              >
                <i className="bi bi-plus-circle text-muted fs-3"></i>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
