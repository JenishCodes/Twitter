import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import List from "../components/List";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import { AuthContext } from "../config/context";
import { getFirstChatMessage } from "../services/message";
import { getUserFromId } from "../services/user";
import { timeFormatter } from "../utils";

export default function ConversationInfo() {
  const [chatUser, setChatUser] = useState(null);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [startedOn, setStartedOn] = useState("");
  const [startedBy, setStartedBy] = useState("");
  const { user_id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const chatId = [user._id, user_id].sort().join("~");

    if (state && state.chatUser) {
      setChatUser(state.chatUser);
    } else {
      getUserFromId(user_id)
        .then((res) => setChatUser(res.data))
        .catch((err) => console.log(err));
    }

    getFirstChatMessage(chatId)
      .then((res) => {
        setStartedOn(timeFormatter(res.createdAt.seconds * 1000, "Status"));

        if (res.senderId === user._id) {
          setStartedBy("You");
        } else {
          setStartedBy(chatUser.name);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="conversation-info">
      <Header title="Conversation Info" backArrow="full" />
      <Helmet>
        <title>Conversation Info / Twitter</title>
      </Helmet>
      {showModal ? (
        <Modal>
          {loading ? (
            <div>
              <Loading
                show
                style={{ width: "1.5rem", height: "1.5rem" }}
                className="text-app"
              />
              <div className="text-muted fw-bold mt-3">
                Leaving conversation...
              </div>
            </div>
          ) : (
            <div
              className="modal-body bg-primary p-4"
              style={{
                width: "320px",
                borderRadius: "20px",
                maxWidth: "80vw",
                height: "auto",
              }}
            >
              <div className="text-center">
                <i
                  className="bi bi-twitter text-app"
                  style={{ fontSize: "3rem" }}
                ></i>
              </div>
              <div className="fs-3 fw-bold">Leave this conversation?</div>
              <div className="text-muted py-2">
                Leaving conversation will delete all messages in this
                conversation for both you and the other person.
              </div>
              <div className="text-center">
                <div
                  className="btn bg-secondary text-secondary filter pointer w-100 fw-bold rounded-pill mt-2 mb-1"
                  onClick={() => {
                    setLoading(true);
                  }}
                >
                  Leave
                </div>
                <div
                  className="btn hover w-100 border fw-bold rounded-pill mt-1 mb-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancle
                </div>
              </div>
            </div>
          )}
        </Modal>
      ) : null}
      <hr className="my-0" />
      <div className="text-muted px-3 fw-bold fs-6 my-2">Users</div>
      {chatUser ? (
        <List
          className="hover pointer"
          onClick={() => navigate("/" + chatUser.account_name)}
          data={{
            title: chatUser.name,
            subtitle: chatUser.account_name,
            context: chatUser.description,
            image_url: chatUser.profile_image_url,
          }}
        />
      ) : null}
      {user ? (
        <List
          className="hover pointer"
          onClick={() => navigate("/" + user.account_name)}
          data={{
            title: user.name,
            subtitle: user.account_name,
            context: user.description,
            image_url: user.profile_image_url,
          }}
        />
      ) : null}
      <hr className="mb-0" />
      <div className="row m-0">
        <div className="px-3 text-center col-6 border-end py-2">
          <div className="text-muted fs-6 fw-bold">Started on</div>
          <div>{startedOn}</div>
        </div>

        <div className="px-3 text-center col-6 py-2">
          <div className="text-muted fs-6 fw-bold">Started by</div>
          <div>{startedBy}</div>
        </div>
      </div>
      <hr className="mt-0" />
      <div
        className="btn text-danger w-100 hover py-3"
        onClick={() => setShowModal(true)}
      >
        Leave Conversation
      </div>
    </div>
  );
}
