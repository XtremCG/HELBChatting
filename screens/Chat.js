import React, {
  useState,
  useLayoutEffect,
  useCallback,
  useEffect,
} from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { TouchableOpacity, Text, Alert } from "react-native";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, database } from "../config/firebase";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../colors";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();

  const { recipientCourseName, recipientLocation } = route.params || {};
  const recipientEndTime = new Date(route.params.recipientEndTime);
  const recipientSchedulesId = route.params.recipientSchedulesId

  const onPopUpInfo = () => {
    Alert.alert(
      "Information",
      `Course Name: ${recipientCourseName}\nLocation: ${recipientLocation}`,
      [{ text: "OK" }]
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={onPopUpInfo}
        >
          <AntDesign
            name="info"
            size={24}
            color={colors.gray}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const collectionRef = collection(database, "chats");
    const q = query(collectionRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          _id: doc.id,
          text: doc.data().text,
          createdAt: doc.data().createdAt.toDate(),
          user: doc.data().user,
        }))
      );
    });
    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(database, "chats"), {
      _id,
      text,
      createdAt,
      user,
    });
  }, []);

  useEffect(() => {
    const checkIfScheduleIsOver = () => {
      const now = new Date();
      const end = new Date(recipientEndTime);

      if (now >= end) {
        const chatsCollectionRef = collection(database, "chats");

        onSnapshot(chatsCollectionRef, (snapshot) => {
          snapshot.docs.forEach(async (docSnapshot) => {
            const chatDoc = doc(database, "chats", docSnapshot.id);
            await deleteDoc(chatDoc);
          });
        });

        const slotDoc = doc(database, "schedules", recipientSchedulesId);
        deleteDoc(slotDoc)
          .then(() => {
            console.log("Schedule successfully deleted!");
          })
          .catch((error) => {
            console.error("Error removing schedule: ", error);
          });

        Alert.alert(
          "The class has ended",
          "You will be redirected to the homepage",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Home"),
            },
          ]
        );
      }
    };

    const now = new Date();
    const end = new Date(recipientEndTime);

    const timeDifference = end - now;

    if (timeDifference > 0) {
      const timeout = setTimeout(checkIfScheduleIsOver, timeDifference);

      return () => clearTimeout(timeout);
    } else {
      checkIfScheduleIsOver();
    }
  }, [recipientEndTime, navigation]);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: auth.currentUser?.uid,
        name: auth.currentUser?.displayName,
        avatar: auth.currentUser?.photoURL || undefined,
      }}
      messagesContainerStyle={{
        backgroundColor: "#fff",
      }}
    />
  );
}