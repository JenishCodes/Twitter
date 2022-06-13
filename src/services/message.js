import api from "./api";
import {
  addDoc,
  deleteDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
  doc,
  collection,
  limit,
  serverTimestamp,
  updateDoc,
  startAfter,
} from "firebase/firestore";
import { store } from "../config/firebase";
import { deleteChat } from "./chat";

export async function getChatMessages(chatId, lastMessage) {
  try {
    var q;

    if (lastMessage === true) {
      q = query(
        collection(store, "messages"),
        where("chatId", "==", chatId),
        orderBy("createdAt", "desc"),
        limit(20)
      );
    } else {
      q = query(
        collection(store, "messages"),
        where("chatId", "==", chatId),
        orderBy("createdAt", "desc"),
        startAfter(lastMessage),
        limit(20)
      );
    }

    const res = await getDocs(q);

    const messages = res.docs
      .map((d) => {
        return { ...d.data(), _id: d.id };
      })
      .reverse();

    return {
      data: messages,
      lastMessage: res.size === 20 ? res.docs[res.docs.length - 1] : false,
    };
  } catch (err) {
    throw err;
  }
}

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

export async function deleteMessage(messageId, chatId) {
  try {
    await deleteDoc(doc(store, "messages", messageId));

    const lastMessage = await getDocs(
      query(
        collection(store, "messages"),
        where("chatId", "==", chatId),
        orderBy("createdAt", "desc"),
        limit(1)
      )
    );

    if (lastMessage.docs.length > 0) {
      updateDoc(doc(store, "chats", chatId), {
        lastMessageId: lastMessage.docs[0].id,
      });
    } else {
      deleteChat(chatId);
    }
  } catch (err) {
    throw err;
  }
}
