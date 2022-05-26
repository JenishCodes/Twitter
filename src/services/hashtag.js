import api from "./api";

export async function searchHashtags(tag_query, cursor=0) {
  try {
    const res = await api.get(
      "/hashtag/search?&cursor=" +
        cursor +
        "&tag_query=" +
        tag_query.replace("#","%23")
    );
    return res.data.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getHashtagTweets(hashtag) {
  try {
    const res = await api.get("/hashtag/tweets?hashtag=" + hashtag);

    return res.data.data;
  } catch (err) {
    console.log(err);
  }
}
