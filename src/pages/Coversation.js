import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import Message from "../components/Message";
import {
  deleteMessage,
  getChatMessages,
  sendMessage,
} from "../services/message";
import { AuthContext } from "../config/context";
import { getNewMessage } from "../services/chat";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet-async";
import { getUserFromId } from "../services/user";

export default function Chat() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { state } = useLocation();
  const [chatUser, setChatUser] = useState();
  const { user_id } = useParams();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [fetched, setFetched] = useState(false);
  const [tag, setTag] = useState(0);
  const contentRef = useRef();

  useEffect(() => {
    if (fetched) {
      const chatId = [user._id, user_id].sort().join("~");

      const unsub = getNewMessage(chatId, (message) => {
        if (!message.text) return;

        if (messages.length > 0) {
          if (message._id !== messages[messages.length - 1]._id) {
            const lastMessage = messages[messages.length - 1];
            if (
              message.createdAt.seconds - lastMessage.createdAt.seconds <
              60
            ) {
              setMessages([
                ...messages.slice(0, messages.length - 1),
                { ...lastMessage, date: false },
                { ...message, date: true },
              ]);
            } else {
              setMessages([...messages, { ...message, date: true }]);
            }

            if (
              contentRef.current.scrollHeight -
                contentRef.current.scrollTop -
                200 <
              contentRef.current.clientHeight
            ) {
              contentRef.current.scroll(0, contentRef.current.scrollHeight);
            } else {
              console.log(tag);
              setTag(tag + 1);
            }
          }
        } else {
          setMessages([...messages, { ...message, date: true }]);
        }
      });

      return () => unsub();
    }
  }, [fetched, messages]);

  useEffect(() => {
    if (state && state.user) {
      setChatUser(state.user);
    } else {
      getUserFromId(user_id)
        .then((res) => setChatUser(res.data))
        .catch((err) => console.log(err));
    }
  }, [user_id]);

  useEffect(() => {
    if (lastMessage && scrollY === 0) {
      const chatId = [user._id, user_id].sort().join("~");

      if (!fetched) {
        setLoading(true);
      }

      getChatMessages(chatId, lastMessage)
        .then((res) => {
          var next;
          const height = contentRef.current.scrollHeight;

          const newMessages = [...res.data, ...messages];

          setMessages(
            newMessages.map((message, index) => {
              if (index < newMessages.length - 1) {
                next = newMessages[index + 1];
                if (message.senderId === next.senderId) {
                  if (next.createdAt.seconds - message.createdAt.seconds < 60) {
                    return { ...message, date: false };
                  }
                }
              }
              return { ...message, date: true };
            })
          );
          setLastMessage(res.lastMessage);

          if (!fetched) {
            setFetched(true);
          }
          contentRef.current.scroll(
            0,
            contentRef.current.scrollHeight - height
          );
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    } else if (
      scrollY <
      contentRef.current.scrollHeight - contentRef.current.clientHeight
    ) {
      setTag(0);
    }
  }, [scrollY]);

  useEffect(() => {
    contentRef.current.addEventListener("scroll", () =>
      setScrollY(contentRef.current.scrollTop)
    );
    return () => {
      contentRef.current.removeEventListener("scroll", () =>
        setScrollY(contentRef.current.scrollTop)
      );
    };
  }, []);

  const handleDelete = (messageId) => {
    setMessages(messages.filter((message) => message._id !== messageId));
    deleteMessage(messageId, [user._id, user_id].sort().join("~"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const chatId = [user._id, user_id].sort().join("~");
    const message = {
      chatId,
      text,
      senderId: user._id,
      receiverId: user_id,
    };

    sendMessage(message)
      .then(() => setText(""))
      .catch((err) => console.log(err));
  };

  return (
    <div className="chat h-100">
      <Helmet>
        <title>
          {chatUser ? chatUser.name + " / Twitter" : "Coversation / Twitter"}
        </title>
      </Helmet>

      <div className="header position-absolute">
        <div className="d-flex px-2 align-items-center">
          <div
            className="btn hover rounded-circle me-2 py-0 px-2"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left-short fs-1"></i>
          </div>
          <img
            src={chatUser?.profile_image_url}
            className="profile-image rounded-circle me-2"
            alt="profile"
          />
          <div className="flex-grow-1">
            <Link
              className="fw-bold hover-underline fs-4"
              to={"/" + chatUser?.account_name}
              style={{ lineHeight: 1 }}
            >
              {chatUser?.name}
            </Link>
            <div className="text-muted fs-6" style={{ lineHeight: 1 }}>
              {messages.length} Messages
            </div>
          </div>
          <div className="btn rounded-pill hover">
            <i className="bi bi-info-circle"></i>
          </div>
        </div>
      </div>
      <div className="content" ref={contentRef}>
        <div className="messages-container px-3">
          <Loading
            show={loading}
            className="my-5 text-app"
            style={{ width: "1.5rem", height: "1.5rem" }}
          />
          {messages.length > 0
            ? messages.map((message, index) =>
                message ? (
                  <Message
                    key={index}
                    message={message}
                    align={message.senderId === user._id ? "end" : "start"}
                    handleDelete={handleDelete}
                    shape={
                      index === 0 || messages[index - 1].date
                        ? message.date
                          ? "single"
                          : "first"
                        : message.date
                        ? "last"
                        : "middle"
                    }
                  />
                ) : null
              )
            : null}
        </div>
      </div>
      <div
        className="btn rounded-circle bg-muted filter position-absolute"
        style={{
          bottom: "5rem",
          right: "1rem",
          display:
            contentRef.current &&
            scrollY <
              contentRef.current.scrollHeight -
                contentRef.current.clientHeight -
                200
              ? "block"
              : "none",
        }}
        onClick={() => {
          setTag(0);
          contentRef.current.scroll(0, contentRef.current.scrollHeight);
        }}
      >
        <div
          className="bg-app rounded-pill text-white position-absolute px-1"
          style={{
            top: "-0.25rem",
            right: "-0.25rem",
            display: tag > 0 ? "block" : "none",
          }}
        >
          {tag}
        </div>
        <i className="bi bi-chevron-down"></i>
      </div>

      <div className="text-box w-100 bg-primary d-flex align-items-center px-2 border-top py-2">
        <div className="btn hover rounded-circle">
          <i className="bi bi-image"></i>
        </div>
        <div className="btn hover rounded-circle">
          <i className="bi bi-gift"></i>
        </div>
        <div className="flex-grow-1 mx-1">
          <input
            type="text"
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="Type message here"
            className="w-100 text-input text-primary flex-grow-1 py-1"
          />
        </div>
        <div className="border h-100"></div>
        <div
          className={`btn hover rounded-circle${text ? "" : " disabled"}`}
          onClick={handleSubmit}
          onMouseDown={(e) => e.preventDefault()}
        >
          <i className="bi bi-send"></i>
        </div>
      </div>
    </div>
  );
}
