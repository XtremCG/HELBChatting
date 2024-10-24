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

  const { recipientCourseName, recipientLocation, recipientEndTime, recipientSchedulesId } = route.params || {};
  
  const onPopUpInfo = () => {
    Alert.alert(
      "Information",
      `Course Name: ${recipientCourseName}\nLocation: ${recipientLocation}`,
      [{ text: "OK" }]
    );

    Alert.alert("Information", "You will have more informations on schedule later")
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
  
  useEffect(() => {
    let timeoutId;
  
    if (nextSchedule) {
      const now = new Date();
      const timeUntilEnd = recipientEndTime - now;
  
      const deleteScheduleAndChatCollection = async () => {
        try {
          await deleteDoc(doc(database, "schedules", recipientSchedulesId));
  
          const chatCollectionRef = collection(database, "chats");
          const chatQuerySnapshot = await getDocs(chatCollectionRef);
          const batch = writeBatch(database);
  
          chatQuerySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });
  
          await batch.commit();
  
          Alert.alert("Schedule and chat deleted", "The schedule and all chat messages have been deleted.");
          navigation.goBack();
        } catch (error) {
          console.error("Error deleting schedule and chat collection: ", error);
        }
      };
      if (timeUntilEnd > 0) {
        timeoutId = setTimeout(deleteScheduleAndChatCollection, timeUntilEnd);
      } else {
        deleteScheduleAndChatCollection();
      }
    }
  
    return () => clearTimeout(timeoutId);
  }, [recipientEndTime, recipientSchedulesId, navigation]);
  
  


  const onSend = useCallback(async (messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
  
    try {
      await addDoc(collection(database, "chats"), {
        _id,
        text,
        createdAt,
        user,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert("Error", "Message could not be sent. Please try again.");
    }
  }, []);
  


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