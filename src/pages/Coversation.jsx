import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import Message from "../components/Message";
import {
  deleteMessage,
  getChatMessages,
  sendMessage,
} from "../services/message";
import { AuthContext } from "../context";
import Loading from "../components/Loading";
import { Helmet } from "react-helmet-async";
import { getUserFromId } from "../services/user";

export default function Chat() {
  const navigate = useNavigate();
  const { user, socket } = useContext(AuthContext);
  const { state } = useLocation();
  const [conversationUser, setConversationUser] = useState();
  const { user_id } = useParams();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [lastMessage, setLastMessage] = useState(null);
  const [fetched, setFetched] = useState(false);
  const [tag, setTag] = useState(0);
  const contentRef = useRef();

  useEffect(() => {
    if (hasMore && scrollY === 0) {
      const chatId = [user._id, user_id].sort().join("~");

      setLoading(!fetched);

      getChatMessages(chatId, messages.length)
        .then((res) => {
          var next;
          const height = contentRef.current.scrollHeight;

          const newMessages = res.data.map((message, index) => {
            if (index < res.data.length - 1) {
              next = res.data[index + 1];
            } else {
              if (messages.length > 0) {
                next = messages[0];
              } else {
                return { ...message, date: true };
              }
            }

            const date = !(
              message.sender === next.sender &&
              new Date(next.createdAt).getTime() -
                new Date(message.createdAt).getTime() <
                60000
            );

            return { ...message, date };
          });

          setMessages([...newMessages, ...messages]);
          setHasMore(res.hasMore);

          setFetched(true);
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
    if (state && state.user) {
      setConversationUser(state.user);
    } else {
      getUserFromId(user_id)
        .then((res) => setConversationUser(res))
        .catch((err) => console.log(err));
    }

    contentRef.current.addEventListener("scroll", () =>
      setScrollY(contentRef.current.scrollTop)
    );
    return () => {
      contentRef.current.removeEventListener("scroll", () =>
        setScrollY(contentRef.current.scrollTop)
      );
    };
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("message-received", setLastMessage);
    }
  }, [socket.current]);

  useEffect(() => {
    if (lastMessage) handleNewMessage(lastMessage);
  }, [lastMessage]);

  useEffect(() => {
    const ref = contentRef.current;
    if (ref.scrollHeight - ref.scrollTop - 200 < ref.clientHeight) {
      ref.scroll(0, ref.scrollHeight);
    } else {
      setTag(tag + 1);
    }
  }, [messages]);

  const handleNewMessage = (message) => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage._id === message._id) return;

      if (
        lastMessage.sender === message.sender &&
        new Date(message.createdAt).getTime() -
          new Date(lastMessage.createdAt).getTime() <
          60000
      ) {
        setMessages([
          ...messages.slice(0, messages.length - 1),
          { ...lastMessage, date: false },
          { ...message, date: true },
        ]);
        return;
      }
    }
    setMessages([...messages, { ...message, date: true }]);
  };

  const handleDelete = (messageId) => {
    setMessages(messages.filter((message) => message._id !== messageId));
    deleteMessage(messageId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (text.length === 0) return;

    const conversationId = [user._id, user_id].sort().join("~");
    const message = {
      conversationId,
      text,
      sender: user._id,
      receiver: user_id,
    };

    sendMessage(message)
      .then((res) => {
        socket.current.emit("messae-sent", res);
        handleNewMessage(res);
        setText("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="conversation h-100">
      <Helmet>
        <title>
          {conversationUser
            ? conversationUser.name + " / Twitter"
            : "Coversation / Twitter"}
        </title>
      </Helmet>

      <div className="header position-absolute">
        <div className="d-flex px-2 align-items-center py-1">
          <div
            className="btn hover rounded-circle me-2 py-0 px-2"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left-short fs-1"></i>
          </div>
          <img
            src={conversationUser?.profile_image_url}
            className="profile-image rounded-circle me-2 square"
            alt="profile"
          />
          <div className="flex-grow-1">
            <Link
              className="fw-bold hover-underline fs-4 line-height-1"
              to={"/" + conversationUser?.account_name}
            >
              {conversationUser?.name}
            </Link>
            <div className="text-muted fs-6 line-height-1">
              {messages.length} Messages
            </div>
          </div>
          <div
            className="btn rounded-pill hover"
            onClick={() => navigate("info", { conversationUser })}
          >
            <i className="bi bi-info-circle"></i>
          </div>
        </div>
      </div>
      <div className="content" ref={contentRef}>
        <div className="messages-container px-3">
          <Loading show={loading} className="my-5 text-app" />
          {messages?.map(
            (message, index) =>
              message && (
                <Message
                  key={index}
                  message={message}
                  align={message.sender === user._id ? "end" : "start"}
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
              )
          )}
        </div>
      </div>
      <div
        className={`btn to-bottom rounded-circle bg-muted filter position-absolute d-${
          contentRef.current &&
          scrollY <
            contentRef.current.scrollHeight -
              contentRef.current.clientHeight -
              200
            ? "block"
            : "none"
        }`}
        onClick={() => {
          setTag(0);
          contentRef.current.scroll(0, contentRef.current.scrollHeight);
        }}
      >
        <div
          className={`bg-app rounded-pill text-white position-absolute px-1 d-${
            tag > 0 ? "block" : "none"
          }`}
        >
          {tag}
        </div>
        <i className="bi bi-chevron-down"></i>
      </div>

      <div className="text-box w-100 bg-primary d-flex align-items-center p-2 border-top position-sticky bottom-0">
        <form className="d-flex flex-grow-1" onSubmit={handleSubmit}>
          <div className="flex-grow-1 ms-2 me-1 pe-2 border-end">
            <input
              type="text"
              onChange={(e) => setText(e.target.value)}
              value={text}
              placeholder="Type message here"
              className="w-100 text-input text-primary flex-grow-1 py-1"
            />
          </div>
          <div
            className={`btn hover rounded-circle${text ? "" : " disabled"}`}
            onClick={handleSubmit}
          >
            <i className="bi bi-send"></i>
          </div>
        </form>
      </div>
    </div>
  );
}
