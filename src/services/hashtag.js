import api from "./api";

export async function searchHashtags(query, page, limit) {
  try {
    const res = await api.get(
      `/hashtag/search?query=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getHashtagTweets(tag, page) {
  try {
    const res = await api.get(`/hashtag/${tag}?page=${page}`);

    return res.data;
  } catch (err) {
    console.log(err);
  }
}
