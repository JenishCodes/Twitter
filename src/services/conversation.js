import api from "./api";

export async function getConversations(userId) {
  try {
    const res = await api.get(`/conversation/user/${userId}`);
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getConversation(conversationId, userId) {
  try {
    const res = await api.get(
      `/conversation/${conversationId}?user_id=${userId}`
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
