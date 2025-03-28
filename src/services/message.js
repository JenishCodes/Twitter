import api from "./api";

export async function getChatMessages(conversationId, page) {
  try {
    const res = await api.get(`/message/${conversationId}?page=${page}`);

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function sendMessage(message) {
  try {
    const res = await api.post("/message", message);

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteMessage(messageId) {
  try {
    const res = await api.delete(`/message/${messageId}`);

    return res.data;
  } catch (err) {
    throw err;
  }
}
