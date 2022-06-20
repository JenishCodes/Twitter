import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getUserFavorites } from "./favorite";
import jwtDecode from "jwt-decode";
import api from "./api";

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

export async function deleteSearchHistory(delete_all) {
  try {
    await api.delete(`/user/history?delete_all=${delete_all}`);
  } catch (err) {
    console.log(err);
  }
}

export async function getSeachHistory() {
  try {
    const res = await api.get(`/user/history`);

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
    const res = await api.post(`/user/history`, {
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

export async function getBookmarkedTweets(page) {
  try {
    const res = await api.get(`/user/bookmarks?page=${page}`);

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getUserFeed(page) {
  try {
    const res = await api.get(`/user/feed?page=${page}`);

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function getUserFromId(id) {
  try {
    const res = await api.get(`/user?key=_id&value=${id}`);

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

export async function getUserSettings() {
  try {
    const res = await api.get(`/user/settings`);

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function updateUserSettings(settings) {
  try {
    await api.put(`/user/settings`, settings);
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

export async function updateAccountName(account_name, password) {
  try {
    await api.put(`/user/updateAccountName`, {
      account_name,
      password,
    });
  } catch (err) {
    throw err;
  }
}

export async function editProfile(user_id, data) {
  try {
    if (data.profile_image_url) {
      const profileImageRef = ref(storage, `/profile_images/${user_id}`);

      await uploadBytes(profileImageRef, data.profile_image_url);
      const profile_image_url = await getDownloadURL(profileImageRef);

      data = { ...data, profile_image_url };
    }

    if (data.banner_image_url) {
      const bannerImageRef = ref(storage, `/banner_images/${user_id}`);

      await uploadBytes(bannerImageRef, data.banner_image_url);
      const banner_image_url = await getDownloadURL(bannerImageRef);

      data = { ...data, banner_image_url };
    }

    const res = await api.put(`/user`, data);

    return res.data;
  } catch (err) {
    throw err;
  }
}

export async function signup(name, email, password, account_name) {
  const res = await api.post("/user", {
    name,
    email,
    password,
    account_name,
  });

  api.defaults.headers.common["x-auth-token"] = res.headers["x-auth-token"];

  localStorage.setItem("token", res.headers["x-auth-token"]);

  return res.data;
}

export async function signin(credential, password) {
  const res = await api.post("/user/signin", {
    credential,
    password,
  });

  api.defaults.headers.common["x-auth-token"] = res.headers["x-auth-token"];

  localStorage.setItem("token", res.headers["x-auth-token"]);
  return res.data;
}

export function logout() {
  try {
    localStorage.removeItem("token");

    api.defaults.headers.common["x-auth-token"] = null;
  } catch (err) {
    throw err;
  }
}

export async function signinAnonymously() {
  try {
    const res = await api.post("/user/signinAnonymously");

    localStorage.setItem("token", res.data);
  } catch (err) {
    throw err;
  }
}

export async function resetPassword(oldPassword, newPassword) {
  try {
    await api.put(`/user/resetPassword`, {
      old_password: oldPassword,
      new_password: newPassword,
    });
  } catch (err) {
    throw err;
  }
}

export async function updateUserEmail(newEmail, password) {
  try {
    await api.put(`/user/updateEmail`, {
      email: newEmail,
      password,
    });
  } catch (err) {
    throw err;
  }
}

export function getJwt() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return getJwt() ? jwtDecode(getJwt()) : false;
}

export async function deleteUser() {
  try {
    await api.delete("/user");

    logout();

    return true;
  } catch (err) {
    throw err;
  }
}
