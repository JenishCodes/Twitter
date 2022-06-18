import api from "./api";

export async function makeFavorite(tweet) {
  try {
    const res = await api.post("/favorite", {
      tweet,
    });

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function removeFavorite(tweet_id) {
  try {
    const res = await api.delete(`/favorite?tweet_id=${tweet_id}`);

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function isFavoriter(tweet_id) {
  try {
    const res = await api.get(`/favorite/isFavoriter?tweet_id=${tweet_id}`);

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
