import {
  getDocs,
  query,
  where,
  collection,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { store } from "../config/firebase";
import api from "./api";

export async function getChats(userId) {
  try {
    const chats = await getDocs(
      query(
        collection(store, "chats"),
        where("userIds", "array-contains", userId)
      )
    );

    const results = await Promise.all(
      chats.docs.map(async (d) => {
        const chat = d.data();
        const lastMessage = await getDoc(
          doc(store, "messages", chat.lastMessageId)
        );

        var chatUserId;
        if (chat.userIds[0] === userId) {
          chatUserId = chat.userIds[1];
        } else {
          chatUserId = chat.userIds[0];
        }

        const user = await api.get("/user/show?user_id=" + chatUserId);

        return {
          lastMessage: { ...lastMessage.data(), _id: chat.lastMessageId },
          user: user.data.data,
          chatId: chat.userIds.join("~"),
        };
      })
    );

    return { data: results };
  } catch (err) {
    throw err;
  }
}

export function getNewMessage(chatId, callback) {
  return onSnapshot(doc(store, "chats", chatId), (snapshot) => {
    const lastMessage = snapshot.data().lastMessageId;

    getDoc(doc(store, "messages", lastMessage)).then((res) =>
      callback({ ...res.data(), _id: lastMessage })
    ).catch((err) => console.log(err));
  });
}
