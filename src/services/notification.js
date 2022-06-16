import api from "./api";

export async function getNotifications(userId, page) {
  try {
    const res = await api.get(`/notification/${userId}?page=${page}`);

    api.put(`/notification/${userId}/seen`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getUnseenNotififcationCount(userId) {
  try {
    const res = await api.get(`/notification/${userId}/unseen`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function markNotificationAsRead(notificationId) {
  try {
    await api.put(`/notification/${notificationId}/read`);
  } catch (err) {
    console.log(err);
  }
}
