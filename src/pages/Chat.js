import React, { useContext, useEffect, useState } from "react";
import List from "../components/List";
import Header from "../components/Header";
import { AuthContext } from "../config/context";
import { getChats } from "../services/chat";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { timeFormatter } from "../utils";
import { Helmet } from "react-helmet-async";

export default function Message() {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getChats(user._id)
      .then((res) => {
        console.log(res)
        setChats(res.data)
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="chats">
      <Helmet>
        <title>Messages / Twitter</title>
      </Helmet>

      <Header title="Messages" subtitle={chats.length + " Conversations"} />

      {chats.length > 0
        ? chats.map((chat, index) => (
            <List
              key={index}
              className="hover pointer"
              onClick={() =>
                navigate("/messages/" + chat.user._id, {
                  state: { user: chat.user },
                })
              }
              data={{
                image_url: chat.user.profile_image_url,
                title: chat.user.name,
                subtitle: chat.lastMessage._id
                  ? chat.lastMessage.text
                    ? chat.lastMessage.text
                    : "This Message has been deleted"
                  : "",
              }}
              actionButton={
                chat.lastMessage._id && (
                  <div className="text-muted oneline">
                    {timeFormatter(
                      chat.lastMessage.createdAt.seconds * 1000,
                      "Ago"
                    )}
                  </div>
                )
              }
            />
          ))
        : !loading && (
            <div className="text-center text-muted mt-5">No messages yet</div>
          )}
      <Loading
        show={loading}
        className="my-5 text-app"
        style={{ width: "1.5rem", height: "1.5rem" }}
      />
      {chats.length > 0 ? <div className="h-50-vh"></div> : null}
    </div>
  );
}
