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
  getDocs
} from "firebase/firestore";
import { auth, database } from "../config/firebase";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../colors";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();

  const { recipientCourseName, recipientLocation, recipientEndTime } = route.params || {};

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
    const collectionRef = collection(database, "messages");
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

  const onSend = useCallback(async (messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];

    try {
      await addDoc(collection(database, "messages"), {
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

  useEffect(() => {
    const endTime = new Date(recipientEndTime);
    const now = new Date();
    const timeUntilEnd = endTime - now;
    const messagesRef = collection(database, "messages");

    if (timeUntilEnd > 0) {
      const timeoutId = setTimeout(async () => {
        try {
          // Récupérer tous les documents de la collection
          const querySnapshot = await getDocs(messagesRef);
          const deletePromises = [];

          // Itérer sur chaque document et le supprimer
          querySnapshot.forEach((doc) => {
            deletePromises.push(deleteDoc(doc.ref));
          });

          // Attendre que toutes les suppressions soient terminées
          await Promise.all(deletePromises);

          setMessages([]);
          Alert.alert(
            "Schedule over",
            "You will be redirected to the home page",
            [{ text: "OK", onPress: () => navigation.goBack() }]
          );

        } catch (error) {
          console.error("Erreur lors de la suppression de la collection de messages :", error);
        }
      }, timeUntilEnd);

      return () => clearTimeout(timeoutId);
    }
  }, [recipientEndTime]);

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
