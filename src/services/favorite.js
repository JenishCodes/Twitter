import api from "./api";

export async function makeFavorite(author_id, tweet_id) {
  try {
    const res = await api.post("/favorite", {
      author_id,
      tweet_id,
    });

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function removeFavorite(author_id, tweet_id) {
  try {
    const res = await api.delete(
      "/favorite?author_id=" + author_id + "&tweet_id=" + tweet_id
    );

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function isFavoriter(user_id, tweet_id) {
  try {
    const res = await api.get(
      "/favorite/isFavoriter?user_id=" + user_id + "&tweet_id=" + tweet_id
    );

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getTweetFavoriters(id, page) {
  try {
    const res = await api.get(
      "/favorite/favoriters?id=" + id + "&page=" + page
    );

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getUserFavorites(user_id) {
  try {
    const res = await api.get("/favorite/user?id=" + user_id);

    return res.data;
  } catch (err) {
    throw err;
  }
}
