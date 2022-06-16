import api from "./api";

export async function makeFavorite(author, tweet) {
  try {
    const res = await api.post("/favorite", {
      author,
      tweet,
    });

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function removeFavorite(author_id, tweet_id) {
  try {
    const res = await api.delete(
      `/favorite?tweet_id=${tweet_id}&author_id=${author_id}`
    );

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function isFavoriter(user_id, tweet_id) {
  try {
    const res = await api.get(
      `/favorite/isFavoriter?tweet_id=${tweet_id}&user_id=${user_id}`
    );

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getTweetFavoriters(tweet_id, page) {
  try {
    const res = await api.get(`/favorite/${tweet_id}/favoriters?page=${page}`);

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getUserFavorites(user_id, page) {
  try {
    const res = await api.get(`/favorite/${user_id}/favorites?page=${page}`);

    return res.data;
  } catch (err) {
    throw err;
  }
}
