import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { createUserWithEmailAndPassword, updateProfile  } from "firebase/auth";
import { auth } from "../config/firebase";
const backImage = require("../assets/backImage.png");
import Toast from "react-native-toast-message";

export default function Register({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const onHandleSignup = async () => {
    if (email === "" || password1 === "" || password2 === "" || username === "") {
      Alert.alert("Please fill in all fields");
      return;
    }
    if (password1 !== password2) {
      Alert.alert("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password1);
      await updateProfile(userCredential.user, {
        displayName: username,

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
      <Image source={backImage} style={styles.backImage} />
      <View style={styles.whiteSheets} />
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Username"
          autoCapitalize="none"
          value={username}
          autoFocus={true}
          onChangeText={(text) => setUsername(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

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

        <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
          <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
            Sign Up
          </Text>
        </TouchableOpacity>

        <View style={styles.loginPrompt}>
          <Text style={{ color: "grey", fontWeight: "600", fontSize: 14 }}>
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: "#7383f3", fontWeight: "600", fontSize: 14 }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#7383f3",
    alignSelf: "center",
    paddingBottom: 24,
    marginTop: 160,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
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
    height: "75%",
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
    backgroundColor: "#7383f3",
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  imagePickerButton: {
    backgroundColor: "#7383f3",
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
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
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
});
