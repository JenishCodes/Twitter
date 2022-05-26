import api from "./api";
import {
  addDoc,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  startAt,
  where,
  doc,
  collection,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { store } from "../config/firebase";

export async function getChatMessages(chatId, page, userId = null) {
  try {
    const q = query(
      collection(store, "messages"),
      where("chatId", "==", chatId),
      orderBy("createdAt", "desc")
      // startAt(page * 20),
      // limit(20)
    );

    const res = await getDocs(q);

    const messages = res.docs
      .map((d) => {
        return { ...d.data(), _id: d.id };
      })
      .reverse();

    if (userId) {
      const user = await api.get("/user/show?user_id=" + userId);

      return {
        user: user.data,
        data: messages,
      };
    } else {
      return {
        data: messages,
      };
    }
  } catch (err) {
    throw err;
  }
}

// export async function getChatMessages(chatId, page, limit, userId) {
//   try {
//     const res = await api.get(
//       "/message/" +
//         chatId +
//         "?page=" +
//         page +
//         "&limit=" +
//         limit +
//         "&userId=" +
//         userId
//     );

//     return res.data;
//   } catch (err) {
//     throw err;
//   }
// }

export async function sendMessage(message) {
  try {
    const res = await addDoc(collection(store, "messages"), {
      ...message,
      createdAt: serverTimestamp(),
    });

    await setDoc(
      doc(store, "chats", message.chatId),
      {
        userIds: message.chatId.split("~"),
        lastMessageId: res.id,
      },
      { merge: true }
    );
  } catch (err) {
    throw err;
  }
}

// export async function sendMessage(message) {
//   try {
//     const res = await api.post("/message", message);

//     return res.data;
//   } catch (err) {
//     throw err;
//   }
// }

export async function deleteMessage(messageId) {
  try {
    const res = await deleteDoc(doc(store, "messages", messageId));

    return res;
  } catch (err) {
    throw err;
  }
}

// export async function deleteMessage(messageId) {
//   try {
//     const res = await api.delete("/message/" + messageId);

//     return res.data;
//   } catch (err) {
//     throw err;
//   }
// }
