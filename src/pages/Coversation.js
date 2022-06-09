import React, { useContext, useEffect, useState, useRef } from "react";
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

export default function Chat(props) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { state } = useLocation();
  const [chatUser, setChatUser] = useState();
  const { user_id } = useParams();
  const [cursor, setCursor] = useState(0);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cursor > 0) {
      const chatId = [user._id, user_id].sort().join("~");

      const unsub = getNewMessage(chatId, (message) => {
        if (!message.text) {
          return;
        }

        if (messages.length === 0) {
          setMessages([{ ...message, date: true }]);
        } else if (message._id !== messages[messages.length - 1]._id) {
          const lastMessage = messages[messages.length - 1];

          if (message.createdAt.seconds - lastMessage.createdAt.seconds <= 60) {
            setMessages([
              ...messages.slice(0, messages.length - 1),
              { ...lastMessage, date: false },
              { ...message, date: true },
            ]);
          } else {
            setMessages([...messages, { ...message, date: true }]);
          }
          window.scrollTo(0, document.body.scrollHeight);
        }
      });

      return () => {
        unsub();
      };
    }
  }, [cursor, messages]);

  useEffect(() => {
    const chatId = [user._id, user_id].sort().join("~");

    if (state && state.user) {
      setChatUser(state.user);
    }
    setLoading(true);

    getChatMessages(chatId, cursor, !state?.user && user_id)
      .then((res) => {
        if (res.user) {
          setChatUser(res.user);
        }
        var next;

        const updatedMessages = res.data.map((message, index) => {
          if (index < res.data.length - 1) {
            next = res.data[index + 1];
            if (next.createdAt.seconds - message.createdAt.seconds <= 60) {
              return { ...message, date: false };
            } else {
              return { ...message, date: true };
            }
          } else {
            if (
              messages[0] &&
              messages[0].createdAt.seconds - message.createdAt.seconds <= 60
            ) {
              return { ...message, date: false };
            } else {
              return { ...message, date: true };
            }
          }
        });

        setMessages(updatedMessages.concat(messages));
        setCursor(cursor + 1);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
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
      <div className="content">
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
      <div className="text-box w-100 bg-primary d-flex align-items-center px-2 border-top py-2">
        <div
          className="btn hover rounded-circle"
          onClick={() => console.log(messages)}
        >
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
