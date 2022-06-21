import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context";
import { searchHashtags } from "../services/hashtag";
import { postTweet } from "../services/tweet";
import { searchUser } from "../services/user";
import { parseTweet, timeFormatter } from "../utils";
import List from "./List";
import Loading from "./Loading";
import Modal from "./Modal";

export default function Editor({
  show,
  reference_tweet,
  referenced_tweet,
  setShow,
}) {
  const { user } = useContext(AuthContext);
  const [text, setText] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [searchDataType, setSearchDataType] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState();
  const [replySetting, setReplySetting] = useState("everyone");
  const [imageUrl, setImageUrl] = useState();
  const navigate = useNavigate();
  const tweet = useRef();

  const setTweetInnerHTML = (newText) => {
    tweet.current.innerHTML = parseTweet(newText);

    var range = document.createRange();
    range.selectNodeContents(tweet.current);
    range.collapse(false);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const handleTextChange = (newText) => {
    setText(newText);

    const lines = newText.split("\n");
    const words = lines[lines.length - 1].split(" ");
    const lastWord = words[words.length - 1];

    if (lastWord === "") {
      setTweetInnerHTML(newText);
      setSearchData([]);
    } else if (lastWord.charAt(0) === "@" && lastWord.length > 1) {
      setTweetInnerHTML(newText);
      searchUser(lastWord, false, 0, 3).then((res) => {
        setSearchDataType("user");
        setSearchData(res.data);
      });
    } else if (lastWord.charAt(0) === "#" && lastWord.length > 1) {
      setTweetInnerHTML(newText);
      setSearchDataType("hashtag", 0, 3);
      searchHashtags(lastWord, 0, 3).then((res) => setSearchData(res.data));
    } else {
      setSearchData([]);
    }
  };

  const handleOnClick = (word) => {
    const words = text.split(" ");
    words.pop();
    words.push(word);

    setTweetInnerHTML(words.join(" ") + " ");
    handleTextChange(words.join(" ") + " ");
  };

  const handlePost = () => {
    setLoading(true);
    if (reference_tweet) {
      postTweet({
        text: text.slice(0, 256),
        author: user._id,
        reply_settings: replySetting,
        media: image,
        replyTo: reference_tweet.author._id,
        referenced_tweet: [
          ...referenced_tweet,
          { type: "replied_to", id: reference_tweet._id },
        ],
      })
        .then((res) => {
          setText("");
          tweet.current.innerHTML = "";
          navigate(`/${user.account_name}/status/${res}`);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setLoading(false);
          setShow(false);
          document.body.style.overflowY = "scroll";
        });
    } else {
      postTweet({
        text: text.slice(0, 256),
        media: image,
        reply_settings: replySetting,
        author: user._id,
      })
        .then((res) => {
          setText("");
          tweet.current.innerHTML = "";
          navigate(`/${user.account_name}/status/${res}`);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setLoading(false);
          setShow(false);
          document.body.style.overflowY = "scroll";
        });
    }
  };

  return show ? (
    <Modal className="w-100 h-100">
      <div className="compose bg-primary w-100 h-100 overflow-y-auto">
        <div className="w-100 position-sticky top-0 px-2 py-1">
          <div
            className="btn hover rounded-circle px-2 py-0 my-1"
            onClick={() => {
              setText("");
              setShow(false);
              document.body.style.overflowY = "scroll";
            }}
          >
            <i className="bi bi-x fs-1"></i>
          </div>
        </div>
        {reference_tweet && (
          <div className="tweet border-0 px-3 pt-2 w-100 text-start">
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-column align-items-center">
                <div className="profile-image">
                  <img
                    className="w-100 h-auto rounded-circle square"
                    src={reference_tweet.author.profile_image_url}
                    alt=""
                  />
                </div>
                <div className="flex-grow-1 border bg-secondary link"></div>
              </div>
              <div className="details">
                <div className="info d-flex align-items-center position-relative">
                  <div className="d-flex flex-grow-1 flex-wrap">
                    <div className="name me-1 fw-bold">
                      {reference_tweet.author.name}
                    </div>
                    <div className="d-flex">
                      <div className="username text-muted me-1">
                        @{reference_tweet.author.account_name}
                      </div>
                      <div className="text-muted">
                        {" "}
                        · {timeFormatter(reference_tweet.createdAt, "Tweet")}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tweet-text">{reference_tweet.text}</div>
                {reference_tweet.media && (
                  <div className="media my-2">
                    <img
                      className="w-100 h-auto border radius"
                      src={reference_tweet.media}
                      alt=""
                    />
                  </div>
                )}
                <div className="text-muted fst-italic mb-3 mt-4">
                  <span>Replying to </span>
                  <Link
                    className="hover-underline"
                    to={"/" + reference_tweet.author.account_name}
                  >
                    @{reference_tweet.author.account_name}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="editor">
          <div className="px-3 pb-3 d-flex">
            <div className="me-3 profile-image">
              <img
                src={user.profile_image_url}
                className="w-100 h-auto rounded-circle square"
                alt="profile"
              />
            </div>

            <div className="editor-area">
              <div className="text-area">
                <div
                  ref={tweet}
                  className={`pb-3 text-field w-100 fs-3${
                    text ? "" : " text-muted"
                  }`}
                  onInputCapture={(e) =>
                    handleTextChange(e.currentTarget.innerText)
                  }
                  placeholder="What's Happening"
                  contentEditable={!loading}
                  spellCheck
                ></div>
              </div>

              {image && (
                <div className="media position-relative my-2">
                  <div
                    className="btn position-absolute m-2 filter bg-muted rounded-circle px-1 py-0"
                    onClick={() => {
                      setImageUrl("");
                      setImage(null);
                    }}
                  >
                    <i className="bi bi-x fs-2"></i>
                  </div>
                  <img
                    className="w-100 h-auto border radius"
                    src={imageUrl}
                    alt=""
                  />
                </div>
              )}
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div
                    className="btn hover rounded-circle me-1"
                    onClick={(e) => e.currentTarget.firstChild.click()}
                  >
                    <input
                      type="file"
                      className="d-none"
                      onChange={(e) => {
                        setImage(e.currentTarget.files[0]);
                        setImageUrl(
                          URL.createObjectURL(e.currentTarget.files[0])
                        );
                      }}
                    />
                    <i className="bi text-primary bi-image fs-3"></i>
                  </div>
                  <div className="dropdown fs-6 ms-1">
                    <div
                      className="btn dropdown-toggle hover rounded-pill"
                      type="button"
                      id="reply-setting"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {replySetting === "everyone"
                        ? "Everyone"
                        : replySetting === "followings"
                        ? "Only Followings"
                        : "Nobody"}
                    </div>
                    <ul
                      className="dropdown-menu bg-primary"
                      aria-labelledby="reply-setting"
                    >
                      <li
                        className="hover pointer px-3 py-1 text-primary"
                        onClick={() => setReplySetting("everyone")}
                      >
                        Everyone
                      </li>
                      <li
                        className="hover pointer px-3 py-1 text-primary"
                        onClick={() => setReplySetting("followings")}
                      >
                        Only Followings
                      </li>
                      <li
                        className="hover pointer px-3 py-1 text-primary"
                        onClick={() => setReplySetting("nobody")}
                      >
                        Nobody
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className={`text-${
                      text.length > 256 ? "danger" : "muted"
                    } me-3 pointer fs-6`}
                    data-title="Overflowed text will be clipped"
                  >
                    {text.length} / 256
                  </div>
                  <div
                    onClick={handlePost}
                    className={`btn text-white btn-primary rounded-pill py-1 px-3${
                      text && !loading ? "" : " disabled"
                    }`}
                  >
                    {loading ? (
                      <Loading show size="small" className="text-white" />
                    ) : (
                      "Tweet"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {searchData.length > 0 && (
        <div className="auto-compelete bg-primary border-rounded">
          {searchData.map((search, index) => (
            <List
              key={index}
              className="hover pointer"
              data={
                searchDataType === "user"
                  ? {
                      title: search.name,
                      subtitle: "@" + search.account_name,
                      image_url: search.profile_image_url,
                    }
                  : {
                      title: "#" + search.tag,
                      subtitle: search.tweet_count + " Tweets",
                      image: (
                        <div className="text-primary rounded-circle border px-2">
                          <i className="bi bi-hash fs-1"></i>
                        </div>
                      ),
                    }
              }
              onClick={() =>
                searchDataType === "user"
                  ? handleOnClick("@" + search.account_name)
                  : handleOnClick("#" + search.tag)
              }
            />
          ))}
        </div>
      )}
    </Modal>
  ) : null;
}
