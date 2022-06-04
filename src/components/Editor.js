import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../config/context";
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
  referenced_tweets,
  setShow,
}) {
  const [text, setText] = useState();
  const { user } = useContext(AuthContext);
  const [searchData, setSearchData] = useState([]);
  const [searchDataType, setSearchDataType] = useState("");
  const [loading, setLoading] = useState(false);
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
    setText(newText ? newText : null);

    const words = newText.split(" ");
    const word = words[words.length - 1];

    if (word === "") {
      setTweetInnerHTML(newText);
      setSearchData([]);
    } else if (word.charAt(0) === "@" && word.length > 1) {
      setTweetInnerHTML(newText);
      searchUser(word, false, 0, 3).then((res) => {
        setSearchDataType("user");
        setSearchData(res.data);
      });
    } else if (word.charAt(0) === "#" && word.length > 1) {
      setTweetInnerHTML(newText);
      setSearchDataType("hashtag", 0, 3);
      searchHashtags(word, 0, 3).then((res) => setSearchData(res.data));
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
      const references = referenced_tweets;
      references.push({ type: "replied_to", id: reference_tweet._id });

      postTweet(text, user._id, "replied_to", references)
        .then(() => {
          setText("");
          tweet.current.innerHTML = "";
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setLoading(false);
          setShow(false);
          document.body.style.overflowY = "scroll";
        });
    } else {
      postTweet(text, user._id)
        .then(() => {
          setText("");
          tweet.current.innerHTML = "";
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
    <Modal>
      <div className="compose bg-primary p-2">
        <div className="w-100">
          <div
            className="btn hover rounded-circle px-2 py-0"
            onClick={() => {
              setText("");
              setShow(false);
              document.body.style.overflowY = "scroll";
            }}
          >
            <i className="bi bi-x fs-1"></i>
          </div>
        </div>
        {reference_tweet ? (
          <div className="tweet border-0 px-3 pt-2 w-100 text-start">
            <div className="d-flex justify-content-between">
              {reference_tweet.author.profile_image_url ? (
                <div className="d-flex flex-column align-items-center">
                  <div className="profile-image">
                    <img
                      className="w-100 h-auto rounded-circle"
                      src={reference_tweet.author.profile_image_url}
                      alt=""
                    />
                  </div>
                  <div
                    style={{ marginTop: "6px" }}
                    className="flex-grow-1 border bg-secondary"
                  ></div>
                </div>
              ) : null}
              <div
                className={
                  reference_tweet.author.profile_image_url
                    ? "details"
                    : "details w-100"
                }
              >
                <div className="info d-flex align-items-center position-relative">
                  <div className="d-flex flex-grow-1">
                    <div className="name me-1 fw-bold">
                      {reference_tweet.author.name}
                    </div>
                    <div className="username text-muted me-1">
                      @{reference_tweet.author.account_name}
                    </div>
                    <div className="text-muted">
                      {" "}
                      · {timeFormatter(reference_tweet.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="tweet-text">{reference_tweet.text}</div>
              </div>
            </div>
          </div>
        ) : null}
        {reference_tweet ? (
          <div className="d-flex" style={{ marginLeft: "39px" }}>
            <div
              style={{ height: "38px", width: "2px" }}
              className="border bg-secondary"
            ></div>
            <div
              className="text-muted fst-italic mb-3"
              style={{ marginLeft: "40px" }}
            >
              <span>Replying to </span>
              <Link
                className="hover-underline"
                to={"/" + reference_tweet.author.account_name}
              >
                @{reference_tweet.author.account_name}
              </Link>
            </div>
          </div>
        ) : null}
        <div className="editor" style={{ marginTop: "6px" }}>
          <div className="px-3 pb-3 d-flex">
            <div className="me-3 profile-image">
              <img
                src={user.profile_image_url}
                className="w-100 h-auto rounded-circle"
                alt="profile"
              />
            </div>
            <div className="editor-area">
              <div className="text-area position-relative">
                <div
                  ref={tweet}
                  className={`pb-3 text-field w-100 fs-3 ${
                    text ? "" : "text-muted"
                  }`}
                  onInputCapture={(e) =>
                    !loading
                      ? handleTextChange(e.currentTarget.innerText)
                      : null
                  }
                  placeholder="What's Happening"
                  contentEditable
                  spellCheck
                ></div>
                {searchData.length > 0 ? (
                  <div className="auto-compelete bg-primary border-rounded">
                    {searchData.map((search, index) =>
                      searchDataType === "user" ? (
                        <List
                          key={index}
                          className="hover pointer"
                          data={{
                            title: search.name,
                            image_url: search.profile_image_url,
                            subtitle: search.account_name,
                          }}
                          onClick={() =>
                            handleOnClick("@" + search.account_name)
                          }
                        />
                      ) : (
                        <List
                          key={index}
                          className="hover pointer"
                          onClick={() => handleOnClick("#" + search.tag)}
                          data={{
                            title: "#" + search.tag,
                            subtitle: search.tweet_count + " Tweets",
                            image: (
                              <div className="text-primary rounded-circle border px-2">
                                <i className="bi bi-hash fs-1"></i>
                              </div>
                            ),
                          }}
                        />
                      )
                    )}
                  </div>
                ) : null}
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="fs-3">
                  <i className="bi text-primary bi-image me-3"></i>
                  <i className="bi text-primary bi-emoji-smile"></i>
                </div>
                <div>
                  <div
                    onClick={handlePost}
                    className={`btn text-white btn-primary rounded-pill py-1 px-3 ${
                      text && !loading ? "" : "disabled"
                    }`}
                  >
                    {loading ? (
                      <Loading
                        show={true}
                        style={{
                          width: "1rem",
                          height: "1rem",
                          margin: "0 13px",
                        }}
                        className="text-white"
                      />
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
    </Modal>
  ) : null;
}
