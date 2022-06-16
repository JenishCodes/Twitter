import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { auth, storage } from "../firebase";
import api from "./api";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getUserFavorites } from "./favorite";

export async function searchUser(name_query, deep_search, page, limit) {
  try {
    const res = await api.get(
      `/user/search?query=${name_query}&deep_search=${deep_search}&page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function deleteSearchHistory(id, delete_all = false) {
  try {
    await api.delete(`/user/${id}/history?delete_all=${delete_all}`);
  } catch (err) {
    console.log(err);
  }
}

export async function getSeachHistory(user_id) {
  try {
    const res = await api.get(`/user/${user_id}/history`);

    return res.data;
  } catch (err) {
    console.log(err);
  }
}
export async function addSeachHistory(
  user_id,
  title,
  subtitle = null,
  image_url = null
) {
  try {
    const res = await api.post(`/user/${user_id}/history`, {
      user_id,
      title,
      subtitle,
      image_url,
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getBookmarkedTweets(user_id, page) {
  try {
    const res = await api.get(`/user/${user_id}/bookmarks?page=${page}`);

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getUserFeed(user_id, page) {
  try {
    const res = await api.get(`/user/${user_id}/feed?page=${page}`);

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getUserFromId(id) {
  try {
    const res = await api.get(`/user?key=id&value=${id}`);

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getUser(account_name) {
  try {
    const res = await api.get(`/user?key=account_name&value=${account_name}`);

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getUserSettings(user_id) {
  try {
    const res = await api.get(`/user/${user_id}/settings`);

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function updateUserSettings(user_id, settings) {
  try {
    await api.put(`/user/${user_id}/settings`, settings);
  } catch (err) {
    console.log(err);
  }
}

export async function getUserTweets(user_id, page, request_type = "tweets") {
  try {
    var res;

    if (request_type === "likes") {
      res = await getUserFavorites(user_id, page);
      return res;
    } else {
      res = await api.get(`/user/${user_id}/${request_type}?page=${page}`);
      return res.data;
    }
  } catch (err) {
    throw err;
  }
}

export async function pinTweet(user_id, tweet_id) {
  try {
    await api.put(`/user/${user_id}`, {
      pinned_tweet: tweet_id,
    });
  } catch (err) {
    throw err;
  }
}

export async function unpinTweet(user_id) {
  try {
    await api.put(`/user/${user_id}`, {
      pinned_tweet: null,
    });
  } catch (err) {
    throw err;
  }
}

export async function bookmarkTweet(user_id, tweet_id) {
  try {
    await api.post(`/user/${user_id}`, {
      $push: {
        bookmarks: tweet_id,
      },
    });
  } catch (err) {
    throw err;
  }
}

export async function unbookmarkTweet(user_id, tweet_id) {
  try {
    await api.post(`/user/${user_id}`, {
      $pull: {
        bookmarks: tweet_id,
      },
    });
  } catch (err) {
    throw err;
  }
}

export async function updateAccountName(user_id, account_name) {
  try {
    const res = await api.get(
      "/user/isAccountNameAvailable?account_name=" + account_name
    );

    if (res.data) {
      await api.put(`/user/${user_id}/updateAccountName`, {
        account_name,
      });

      await updateProfile(auth.currentUser, {
        displayName: account_name,
      });
    } else {
      throw "Account name is not available";
    }
  } catch (err) {
    throw err;
  }
}

export async function editProfile(user_id, data) {
  try {
    if (data.profile_image_url) {
      const profileImageRef = ref(
        storage,
        `/profile_images/${auth.currentUser.uid}`
      );

      await uploadBytes(profileImageRef, data.profile_image_url);
      const profile_image_url = await getDownloadURL(profileImageRef);

      data = { ...data, profile_image_url };
    }

    if (data.banner_image_url) {
      const bannerImageRef = ref(
        storage,
        `/banner_images/${auth.currentUser.uid}.jpg`
      );

      await uploadBytes(bannerImageRef, data.banner_image_url);
      const banner_image_url = await getDownloadURL(bannerImageRef);

      data = { ...data, banner_image_url };
    }

    api.put(`/user/${user_id}`, data);
  } catch (err) {
    throw err;
  }
}

export async function signup(name, email, password, account_name, uid = null) {
  const res = await api.get(
    "/user/isAccountNameAvailable?account_name=" + account_name
  );

  if (res.data.data) {
    throw Error("Username not available!");
  }

  try {
    if (!uid) {
      const auth_user = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(auth.currentUser, { displayName: account_name });

      uid = auth_user.user.uid;
    }

    await api.post("/user", {
      name,
      account_name,
      auth_id: uid,
    });
  } catch (err) {
    throw err;
  }
}

export async function signin(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    throw err;
  }
}

export async function logout(deleteAlso = false) {
  if (deleteAlso) {
    await auth.currentUser.delete();
  } else {
    await signOut(auth);
  }
}

export async function signinAnonymously() {
  try {
    await signInAnonymously(auth);
  } catch (err) {
    throw err;
  }
}

export async function getPasswordResetLink(email) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    throw err;
  }
}

export async function reAuthenticate(password) {
  try {
    const credentials = EmailAuthProvider.credential(
      auth.currentUser.email,
      password
    );
    await reauthenticateWithCredential(auth.currentUser, credentials);
  } catch (err) {
    throw err;
  }
}
export async function resetPassword(newPassword) {
  try {
    await updatePassword(auth.currentUser, newPassword);
  } catch (err) {
    throw err;
  }
}

export async function updateUserEmail(newEmail) {
  try {
    await updateEmail(auth.currentUser, newEmail);
  } catch (err) {
    throw err;
  }
}
