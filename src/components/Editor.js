import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../config/context";
import { searchHashtags } from "../services/hashtag";
import { postTweet } from "../services/tweet";
import { searchUser } from "../services/user";
import { parseTweet } from "../utils";
import List from "./List";

export default function Editor(props) {
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
    if (props.replying_to) {
      const referenced_tweet = props.referenced_tweet;
      referenced_tweet.push({ type: "replied_to", id: props.tweet_id });

      postTweet(
        text,
        user._id,
        "replied_to",
        referenced_tweet,
        props.replying_to
      )
        .then(() => {
          setText("");
          tweet.current.innerHTML = "";
        })
        .catch((err) => console.log(err)).finally(() => setLoading(false));
    } else {
      postTweet(text, user._id)
        .then(() => {
          setText("");
          tweet.current.innerHTML = "";
        })
        .catch((err) => console.log(err)).finally(() => setLoading(false));
    }
  };

  return (
    <div className="editor border-bottom">
      {props.replying_to ? (
        <div className="text-muted ms-4 ps-5 fs-6 fst-italic">
          <span>Replying to </span>
          <Link className="hover-underline" to={"/" + props.replying_to}>
            @{props.replying_to}
          </Link>
        </div>
      ) : null}
      <div className="p-3 d-flex">
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
              className="pb-3 text-field w-100 fs-3"
              onInputCapture={(e) =>
                !loading ? handleTextChange(e.currentTarget.innerText) : null
              }
              spellCheck={true}
            ></div>
            <div
              className={`z-index-1 position-absolute top-0 left-0 fs-3 text-muted ${text && text !== "\n" ? "d-none" : ""
                }`}
            >
              What's Happening
            </div>
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
                      onClick={() => handleOnClick("@" + search.account_name)}
                    />
                  ) : (
                    <List
                      key={index}
                      className="hover pointer"
                      onClick={() => handleOnClick("#" + search.tag)}
                      data={{
                        title: "#" + search.tag,
                        subtitle: search.tweet_count + " Tweets",
                        image: <div className="text-primary rounded-circle border px-2">
                          <i className="bi bi-hash fs-1"></i>
                        </div>
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
                className={`btn text-white btn-primary rounded-pill py-1 px-3 ${text && !loading ? "" : "disabled"
                  }`}
              >
                {loading ?
                  <div
                    className="spinner-border text-white"
                    style={{ width: "1rem", height: "1rem", margin: "0 13px" }}
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  : "Tweet"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
