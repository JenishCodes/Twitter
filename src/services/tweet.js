import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import { extractEntities } from "../utils";
import api from "./api";

export async function postTweet(tweet) {
  try {
    const entities = extractEntities(tweet.text);

    const res = await api.post("/tweet/create", {
      ...tweet,
      entities,
      media: "",
    });

    if (tweet.media) {
      const mediaRef = ref(storage, `/tweet_images/${res.data.id}`);

      await uploadBytes(mediaRef, tweet.media);
      const media = await getDownloadURL(mediaRef);

      await api.put(`/tweet/update?id=${res.data.id}`, {
        media,
      });
    }
  } catch (err) {
    throw err;
  }
}

export async function updatePrivateMetrics(tweet_id, newData) {
  try {
    await api.put(`/tweet/${tweet_id}`, newData);
  } catch (err) {
    throw err;
  }
}

export async function isRetweeter(tweet_id, user_id) {
  try {
    const res = await api.get(
      `/tweet/${tweet_id}/isRetweeter?user_id=${user_id}`
    );

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getRetweeters(tweet_id, page) {
  try {
    const res = await api.get(`/tweet/${tweet_id}/retweeters?page=${page}`);
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteTweet(tweet_id, author_id = null) {
  try {
    if (author_id) {
      await api.delete(`/tweet/${tweet_id}?author_id=${author_id}`);
    } else {
      await api.delete(`/tweet/${tweet_id}`);
    }
  } catch (err) {
    throw err;
  }
}

export async function getTweetReplies(tweet_id, user_id, page) {
  try {
    const replies = await api.get(
      `/tweet/${tweet_id}/replies?user_id=${user_id}&page=${page}`
    );
    return replies.data;
  } catch (err) {
    throw err;
  }
}

export async function getTweetReferences(tweet_id) {
  const references = await api.get(`/tweet/${tweet_id}/references`);
  return references.data;
}

export async function getTweet(tweet_id) {
  try {
    const tweet = await api.get(`/tweet/${tweet_id}`);
    return tweet.data;
  } catch (err) {
    throw err;
  }
}
export async function getTweetTimeline(tweet_id, user_id) {
  try {
    const tweet = await api.get(`/tweet/${tweet_id}`);

    var references = { data: {} };
    var replies = { data: {} };

    if (tweet.data.data.referenced_tweet.length > 0) {
      references = await api.get(`/tweet/${tweet_id}/references`);
    }
    if (tweet.data.data.public_metrics.reply_count > 0) {
      replies = await api.get(
        `/tweet/${tweet_id}/replies?user_id=${user_id}&page=0`
      );
    }

    return {
      data: tweet.data.data,
      includes: {
        replies: replies.data.data,
        references: references.data.data,
      },
    };
  } catch (err) {
    throw err;
  }
}

export async function searchTweets(query, page) {
  try {
    const res = await api.get(`/tweet/search?query=${query}&page=${page}`);
    return res.data;
  } catch (err) {
    throw err;
  }
}
