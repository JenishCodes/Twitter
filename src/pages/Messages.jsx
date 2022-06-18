import React, { useContext, useEffect, useState } from "react";
import List from "../components/List";
import Header from "../components/Header";
import { AuthContext } from "../context";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { timeFormatter } from "../utils";
import { Helmet } from "react-helmet-async";
import { getConversations } from "../services/conversation";

export default function Messages() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getConversations()
      .then((res) => setConversations(res))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="messages">
      <Helmet>
        <title>Messages / Twitter</title>
      </Helmet>

      <Header
        title="Messages"
        subtitle={conversations.length + " Conversations"}
      />

      {conversations.length > 0
        ? conversations.map((chat, index) => (
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
                subtitle: chat.lastMessage,
                // subtitle: chat.lastMessage._id
                //   ? chat.lastMessage.text
                //     ? chat.lastMessage.text
                //     : "This Message has been deleted"
                //   : "",
              }}
              actionButton={
                // chat.lastMessage._id && (
                //   <div className="text-muted oneline">
                //     {timeFormatter(
                //       chat.lastMessage.createdAt.seconds * 1000,
                //       "Ago"
                //     )}
                //   </div>
                // )
                <div className="text-muted oneline">
                  {timeFormatter(chat.updatedAt, "Ago")}
                </div>
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
      {conversations.length > 0 ? <div className="h-50-vh"></div> : null}
    </div>
  );
}
