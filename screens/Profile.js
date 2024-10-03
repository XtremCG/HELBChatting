import React, { useLayoutEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import colors from "../colors";
import { signOut } from "firebase/auth";
import { auth, database } from "../config/firebase";

const defaultProfilePic = require("../assets/default-profile-pic.png");

const ProfilePage = () => {
  const navigation = useNavigation();
  
  const user = {
    name: auth.currentUser?.displayName,
    email: auth.currentUser.email,
  };

  const onSignOut = () => {
    signOut(auth).catch((e) => console.log(e));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={onSignOut}
        >
          <AntDesign
            name="logout"
            size={24}
            color={colors.gray}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={defaultProfilePic} style={styles.profileImage} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text style={styles.bio}>{user.bio}</Text>
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
  },
  bio: {
    fontSize: 14,
    color: colors.lightGray,
    textAlign: "center",
    marginHorizontal: 40,
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
