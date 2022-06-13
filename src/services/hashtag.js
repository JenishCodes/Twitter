import api from "./api";

export async function searchHashtags(tag_query, page) {
  try {
    const res = await api.get(
      "/hashtag/search?tag_query=" +
        encodeURIComponent(tag_query) +
        "&page=" +
        page
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getHashtagTweets(tag, page) {
  try {
    const res = await api.get("/hashtag/tweets?tag=" + tag + "&page=" + page);
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
  }
}
