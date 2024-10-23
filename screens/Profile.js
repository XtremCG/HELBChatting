import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import colors from "../colors";
import { signOut, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
import Toast from "react-native-toast-message";

const ProfilePage = () => {
  const navigation = useNavigation();
  const [name, setName] = useState(auth.currentUser?.displayName || "");
  const [email, setEmail] = useState(auth.currentUser?.email || "");
  const [profilePic, setProfilePic] = useState(auth.currentUser?.photoURL || undefined);

  const onSignOut = () => {
    signOut(auth).catch((e) => console.log(e));
  };


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={onSignOut} style={{ marginRight: 10 }}>
            <AntDesign name="logout" size={24} color={colors.gray} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={{uri: profilePic}} style={styles.profileImage} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
      <Toast />
    </View>
    
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 20,
  }
});
