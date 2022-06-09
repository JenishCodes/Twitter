import api from "./api";

export async function searchHashtags(tag_query, cursor, limit) {
  try {
    const res = await api.get(
      "/hashtag/search?tag_query=" +
        encodeURIComponent(tag_query) +
        "&cursor=" +
        cursor +
        "&limit=" +
        limit
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getHashtagTweets(hashtag) {
  try {
    const res = await api.get("/hashtag/tweets?hashtag=" + hashtag);

    return res.data;
  } catch (err) {
    console.log(err);
  }
}
