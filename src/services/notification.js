import api from "./api";

export async function getNotifications(page) {
  try {
    const res = await api.get(`/notification?page=${page}`);

    api.put(`/notification/seen`);

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getUnseenNotififcationCount() {
  try {
    const res = await api.get(`/notification/unseen`);
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
