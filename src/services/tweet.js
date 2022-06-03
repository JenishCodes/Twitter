import { extractEntities } from "../utils";
import api from "./api";

export async function postTweet(
  text,
  user_id,
  reference_type = null,
  referenced_tweet = null,
) {
  try {
    const entities = extractEntities(text);

    if (reference_type === "replied_to") {
      await api.post("/tweet/create", {
        author_id: user_id,
        text,
        referenced_tweet,
        entities,
      });
    } else if (reference_type === "retweet_of") {
      await api.post("/tweet/create", {
        author_id: user_id,
        text,
        referenced_tweet,
        entities,
      });
    } else {
      await api.post("/tweet/create", {
        author_id: user_id,
        text,
        entities,
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

export async function getTweetTimeline(tweet_id) {
  try {
    const tweet = await api.get("/tweet/show?id=" + tweet_id);
    var references = { data: {} };
    var replies = { data: {} };

    if (tweet.data.data.referenced_tweet.length > 0) {
      references = await api.get("/tweet/references?id=" + tweet_id);
    }
    if (tweet.data.data.public_metrics.reply_count > 0) {
      replies = await api.get("/tweet/replies?id=" + tweet_id);
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
