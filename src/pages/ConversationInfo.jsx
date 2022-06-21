import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import List from "../components/List";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import { AuthContext } from "../context";
import { deleteConversation, getConversation } from "../services/conversation";
import { timeFormatter } from "../utils";

export default function ConversationInfo() {
  const [conversationUser, setConversationUser] = useState(null);
  const { user } = useContext(AuthContext);
  const [modalLoading, setModalLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [startedOn, setStartedOn] = useState("");
  const { user_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const conversationId = [user._id, user_id].sort().join("~");

    getConversation(conversationId)
      .then((res) => {
        setConversationUser(res.user);
        setStartedOn(timeFormatter(res.createdAt, "Status"));
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
      {showModal && (
        <Modal>
          {modalLoading ? (
            <div>
              <Loading show className="text-app" />
              <div className="text-muted fw-bold mt-3">
                Leaving conversation...
              </div>
            </div>
          ) : (
            <div className="modal-body bg-primary p-4">
              <div className="text-center">
                <i className="bi bi-twitter text-app"></i>
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
                    setModalLoading(true);
                    deleteConversation([user._id, user_id].sort().join("~"))
                      .then(() => navigate("/messages"))
                      .catch((err) => console.log(err))
                      .finally(() => {
                        setModalLoading(false);
                        setShowModal(false);
                      });
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
      )}
      <hr className="my-0" />
      {loading ? (
        <Loading show className="text-app mt-5" />
      ) : (
        <div>
          <div className="text-muted px-3 fw-bold fs-6 my-2">Users</div>
          {conversationUser && (
            <List
              className="hover pointer"
              onClick={() => navigate("/" + conversationUser.account_name)}
              data={{
                title: conversationUser.name,
                subtitle: conversationUser.account_name,
                context: conversationUser.description,
                image_url: conversationUser.profile_image_url,
              }}
            />
          )}
          {user && conversationUser.account_name !== user.account_name && (
            <List
              className="hover pointer"
              onClick={() => navigate("/" + user.account_name)}
              data={{
                title: user.name,
                subtitle: "@" + user.account_name,
                context: user.description,
                image_url: user.profile_image_url,
              }}
            />
          )}
          <hr className="mb-0" />
          <div className="px-3 py-2">
            <div className="text-muted fs-6 fw-bold mb-2">Started on</div>
            <div className="fw-bold">{startedOn}</div>
          </div>
          <hr className="mt-0" />
          <div
            className="btn text-danger w-100 hover py-3"
            onClick={() => setShowModal(true)}
          >
            Leave Conversation
          </div>
        </div>
      )}
    </div>
  );
}
