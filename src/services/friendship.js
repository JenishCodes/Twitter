import api from "./api";

export async function getFollowers(account_name, cursor = 0) {
  try {
    const res = await api.get(
      "/friendship/followers?account_name=" + account_name + "&cursor=" + cursor
    );

    return res.data;
  } catch (err) {
    throw err;
  }
}
export async function getFollowing(account_name, cursor = 0) {
  try {
    const res = await api.get(
      "/friendship/following?account_name=" + account_name + "&cursor=" + cursor
    );

    return res.data;
  } catch (err) {
    throw err;
  }
}
export async function getFriendship(user1_id, user2_id) {
  try {
    const friendship_id = [user1_id, user2_id].sort().join("~");

    const res = await api.get("/friendship?friendship_id=" + friendship_id);

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function follow(user1_id, user2_id) {
  try {
    const friendship_id =
      user1_id > user2_id
        ? user2_id + "~" + user1_id
        : user1_id + "~" + user2_id;

    await api.post("/friendship", {
      followed_by: user1_id,
      following: user2_id,
      friendship_id,
    });
  } catch (err) {
    throw err;
  }
}

export async function unfollow(user1_id, user2_id) {
  try {
    await api.delete(
      "/friendship?source_id=" + user1_id + "&target_id=" + user2_id
    );
  } catch (err) {
    throw err;
  }
}
