import api from "./api";

export async function getFollowers(account_name, page) {
  try {
    const res = await api.get(
      `/friendship/${account_name}/followers?page=${page}`
    );

    return res.data;
  } catch (err) {
    throw err;
  }
}
export async function getFollowing(account_name, page) {
  try {
    const res = await api.get(
      `/friendship/${account_name}/following?page=${page}`
    );

    return res.data;
  } catch (err) {
    throw err;
  }
}
export async function getRelationship(user1, user2) {
  try {
    const res = await api.get(`/friendship?source=${user1}&target=${user2}`);

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function follow(user1, user2) {
  try {
    const friendship_id =
      user1 > user2
        ? user2 + "~" + user1
        : user1 + "~" + user2;

    await api.post("/friendship", {
      followed_by: user1,
      following: user2,
      friendship_id,
    });
  } catch (err) {
    throw err;
  }
}

export async function unfollow(user1, user2) {
  try {
    await api.delete(
      "/friendship?source_id=" + user1 + "&target_id=" + user2
    );
  } catch (err) {
    throw err;
  }
}
