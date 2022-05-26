import React, { useContext, useEffect, useState } from "react";
import List from "../components/List";
import Header from "../components/Header";
import { AuthContext } from "../config/context";
import { getChats } from "../services/chat";

export default function Message() {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getChats(user._id)
      .then((res) => setChats(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="chats">
      <Header title="Messages" subtitle={chats.length + " Conversations"} />
      {loading ? (
        <div className="text-center my-5">
          <div
            className="spinner-border text-app"
            style={{ width: "1.5rem", height: "1.5rem" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : chats.length > 0 ? (
        chats.map((chat, index) => (
          <List
            key={index}
            className="hover pointer"
            action={"/messages/" + chat.user._id}
            data={{
              title: chat.user.name,
              subtitle: chat.lastMessage._id
                ? chat.lastMessage.text
                  ? chat.lastMessage.text
                  : "This Message has been deleted"
                : "",
              image_url: chat.user.profile_image_url,
            }}
            actionState={{ user: chat.user }}
          />
        ))
      ) : (
        <div className="text-center text-muted mt-5">No messages yet</div>
      )}
      {chats.length > 0 ? <div className="my-5 py-5"></div> : null}
    </div>
  );
}
