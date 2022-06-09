import api from "./api";

export async function getNotifications(userId, cursor, limit) {
  try {
    const res = await api.get(
      "/notification?id=" + userId + "&cursor=" + cursor + "&limit=" + limit
    );

    api.put("/notification/seen?id=" + userId);
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getUnseenNotififcationCount(userId) {
  try {
    const res = await api.get("/notification/unseen?id=" + userId);
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function markNotificationAsRead(notificationId) {
  try {
    await api.put("/notification/" + notificationId);
  } catch (err) {
    console.log(err);
  }
}

export async function markAllAsRead(userId) {
  try {
    await api.put("/notification?id=" + userId);
  } catch (err) {
    console.log(err);
  }
}
