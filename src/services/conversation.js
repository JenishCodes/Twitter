import api from "./api";

export async function getConversations() {
  try {
    const res = await api.get(`/conversation/user`);
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getConversation(conversationId) {
  try {
    const res = await api.get(
      `/conversation/${conversationId}`
    );

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteConversation(conversationId) {
  try {
    const res = await api.delete(`/conversation/${conversationId}`);
    return res.data;
  } catch (err) {
    throw err;
  }
}
