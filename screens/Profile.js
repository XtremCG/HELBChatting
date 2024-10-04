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

const defaultProfilePic = require("../assets/default-profile-pic.png");

const ProfilePage = () => {
  const navigation = useNavigation();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [name, setName] = useState(auth.currentUser?.displayName || "");
  const [email, setEmail] = useState(auth.currentUser?.email || "");

  const onSignOut = () => {
    signOut(auth).catch((e) => console.log(e));
  };

  const handleEditProfile = () => setIsEditModalVisible(!isEditModalVisible);

  const handleSaveProfile = () => {
    if (name === "") {
      Alert.alert("Please enter a name");
      return;
    }
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Profile editing",
          text2: "Profile updated successfully",
          duration: 1500,
        });
        setIsEditModalVisible(false);
      })
      .catch((error) => {
        Alert.alert("Error updating profile: ", error.message);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={handleEditProfile}
          >
            <AntDesign
              name="edit"
              size={24}
              color={colors.gray}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSignOut} style={{ marginRight: 10 }}>
            <AntDesign name="logout" size={24} color={colors.gray} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={defaultProfilePic} style={styles.profileImage} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>

      {isEditModalVisible && (
        <View style={styles.editModal}>
          <View style={styles.editModalContent}>
            <Text style={styles.editModalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.editModalInput}
              placeholder="Name"
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <TouchableOpacity
              style={styles.editModalButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.editModalButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  },
  bio: {
    fontSize: 14,
    color: colors.lightGray,
    textAlign: "center",
    marginHorizontal: 40,
    marginBottom: 40,
  },
  editModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  editModalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  editModalInput: {
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: colors.gray,
    marginBottom: 15,
  },
  editModalButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  editModalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
