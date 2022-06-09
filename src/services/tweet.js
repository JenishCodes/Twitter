import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/firebase";
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

export async function getRetweeters(tweet_id, trim_user) {
  try {
    const res = await api.get(
      "/tweet/retweeters?id=" + tweet_id + "&trim_user=" + trim_user
    );
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteTweet(tweet_id, author_id = null) {
  try {
    if (author_id) {
      await api.delete(
        "/tweet/destroy?id=" + tweet_id + "&author_id=" + author_id
      );
    } else {
      await api.delete("/tweet/destroy?id=" + tweet_id);
    }
  } catch (err) {
    throw err;
  }
}

export async function getTweetTimeline(tweet_id, author_id) {
  try {
    const tweet = await api.get("/tweet/show?id=" + tweet_id);
    var references = { data: {} };
    var replies = { data: {} };

    

    if (tweet.data.data.referenced_tweet.length > 0) {
      references = await api.get("/tweet/references?id=" + tweet_id);
    }
    if (tweet.data.data.public_metrics.reply_count > 0) {
      replies = await api.get("/tweet/replies?id=" + tweet_id + "&author_id=" + author_id);
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

export async function searchTweets(query, cursor, limit) {
  try {
    const res = await api.get(
      "/tweet/search?search_query=" +
        query +
        "&cursor=" +
        cursor +
        "&limit=" +
        limit
    );
    return res.data;
  } catch (err) {
    throw err;
  }
}
