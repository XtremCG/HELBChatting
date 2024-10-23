import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../config/firebase";
const backImage = require("../assets/backImage.png");
import Toast from "react-native-toast-message";
import colors from "../colors";
import { Ionicons } from "@expo/vector-icons"; // Icons

export default function Register({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = () => {
        reject(new Error("Erreur lors de la conversion URI en Blob"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  const uploadImage = async (uri) => {
    try {
      const imageRef = ref(storage, `profileImages/${Date.now()}.jpg`);

      const blob = await uriToBlob(uri);

      await uploadBytes(imageRef, blob);

      const downloadURL = await getDownloadURL(imageRef);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Erreur", "Échec de l'upload de l'image.");
      return null;
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri);
      } else {
        console.log("Image selection canceled or no image found");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Image recovery failed.");
    }
  };

  const onHandleSignup = async () => {
    if (
      email === "" ||
      password1 === "" ||
      password2 === "" ||
      username === ""
    ) {
      Alert.alert("Please fill in all fields");
      return;
    }
    if (password1 !== password2) {
      Alert.alert("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password1
      );
      const user = userCredential.user;

      let photoURL = null;
      if (selectedImage) {
        photoURL = await uploadImage(selectedImage);
      }

      await updateProfile(user, {
        displayName: username,
        photoURL: photoURL || undefined,
      });

      Toast.show({
        type: "success",
        text1: "SignUp",
        text2: "Signup success",
        duration: 1500,
      });
    } catch (error) {
      Alert.alert("Error Occurred: ", error.message);
    }
  };

   return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image source={backImage} style={styles.backImage} />

      {/* White Sheets */}
      <View style={styles.whiteSheets} />

      {/* Form Section */}
      <SafeAreaView style={styles.form}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Sign Up</Text>

          {/* Input: Username with Icon */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={24} color="#7383f3" />
            <TextInput
              style={styles.input}
              placeholder="Enter Username"
              autoCapitalize="none"
              value={username}
              autoFocus={true}
              onChangeText={(text) => setUsername(text)}
            />
          </View>

          {/* Input: Email with Icon */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={24} color="#7383f3" />
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>

          {/* Input: Password with Icon */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#7383f3" />
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Enter Password"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              value={password1}
              onChangeText={(text) => setPassword1(text)}
            />
          </View>

          {/* Input: Confirm Password with Icon */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="#7383f3" />
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Confirm Password"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              value={password2}
              onChangeText={(text) => setPassword2(text)}
            />
          </View>

          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <ImageBackground
              source={{ uri: selectedImage }}
              style={styles.imageBackground}
              imageStyle={styles.imageStyle}
            >
              <Text style={styles.buttonText}>Select Profile Image</Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.loginPrompt}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: colors.primary,
    alignSelf: "center",
    paddingBottom: 24,
    marginTop: 160,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  backImage: {
    position: "absolute",
    width: "100%",
    height: 340,
    resizeMode: "cover",
    top: 0,
  },
  whiteSheets: {
    width: "100%",
    height: "85%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 60,
  },
  form: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: colors.primary,
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  imageButton: {
    height: 200,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    overflow: "hidden",
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  signupButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  loginPrompt: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  loginText: {
    color: "grey",
    fontWeight: "600",
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
});