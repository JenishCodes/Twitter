import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { auth, storage } from "../config/firebase";
import api from "./api";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function searchUser(name_query, deep_search, page) {
  try {
    const res = await api.get(
      "/user/search?name_query=" +
        name_query +
        "&deep_search=" +
        deep_search +
        "&page=" +
        page
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function deleteSearchHistory(id, delete_all = false) {
  try {
    await api.delete("/user/history?id=" + id + "&delete_all=" + delete_all);
  } catch (err) {
    console.log(err);
  }
}

export async function getSeachHistory(user_id) {
  try {
    const res = await api.get("/user/history?user_id=" + user_id);

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
    const res = await api.post("/user/history", {
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

export async function getBookmarkedTweets(id, page) {
  try {
    const res = await api.get("/user/bookmarks?id=" + id + "&page=" + page);

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getUserFeed(account_name, page) {
  try {
    const res = await api.get(
      "/user/feed?account_name=" + account_name + "&page=" + page
    );

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getUserFromId(id) {
  try {
    const res = await api.get("/user/show?id=" + id);

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getUser(account_name) {
  try {
    const res = await api.get("/user/show?account_name=" + account_name);

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function getUserSettings(user_id) {
  try {
    const res = await api.get("/user/settings?id=" + user_id);

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function updateUserSettings(user_id, settings) {
  try {
    await api.put("/user/settings?id=" + user_id, settings);
  } catch (err) {
    console.log(err);
  }
}

export async function getUserTweets(account_name, page, request_type = "") {
  try {
    var res;

    if (request_type === "likes") {
      res = await api.get(
        `/favorite/user?account_name=${account_name}&page=${page}`
      );
    } else {
      res = await api.get(
        `/user/tweets/${request_type}?account_name=${account_name}&page=${page}`
      );
    }
    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function pinTweet(tweet_id, user_id) {
  try {
    await api.post("/user/tweet/pin", {
      tweet_id: tweet_id,
      user_id: user_id,
    });
  } catch (err) {
    throw err;
  }
}

export async function unpinTweet(user_id) {
  try {
    await api.post("/user/tweet/unpin", {
      user_id: user_id,
    });
  } catch (err) {
    throw err;
  }
}

export async function bookmarkTweet(tweet_id, user_id) {
  try {
    await api.post("/user/tweet/bookmark", {
      tweet_id: tweet_id,
      user_id: user_id,
    });
  } catch (err) {
    throw err;
  }
}

export async function unbookmarkTweet(tweet_id, user_id) {
  try {
    await api.post("/user/tweet/unbookmark", {
      tweet_id: tweet_id,
      user_id: user_id,
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

    if (res) {
      await api.put("/user/updateAccountName?id=" + user_id, {
        account_name,
      });
    }
  } catch (err) {
    throw err;
  }
}

export async function editProfile(data) {
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


    

    api.put("/user/" + auth.currentUser.uid, data);
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

export async function signUpWithGoogle(operation_type = "signup") {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      if (operation_type === "signup") {
        updateProfile(auth.currentUser, {
          displayName: result.user.email.split("@")[0],
        })
          .then(() =>
            api
              .post("/user", {
                name: result.user.displayName,
                account_name: result.user.email.split("@")[0],
                auth_id: result.user.uid,
              })
              .catch((err) => console.log(err))
          )
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
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