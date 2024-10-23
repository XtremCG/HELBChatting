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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
const backImage = require("../assets/backImage.png");
import { Ionicons } from '@expo/vector-icons'; 
import colors from "../colors";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onHandleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("Please fill in all fields");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
        <Text style={styles.title}>Login</Text>

        {/* Input: Email with Icon */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#7383f3" />
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoFocus={true}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        {/* Input: Password with Icon */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#7383f3" />
          <TextInput
            style={styles.input}
            placeholder="Enter Password"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
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
    height: "80%",
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
    marginTop: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  signupContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  signupText: {
    color: "grey",
    fontWeight: "600",
    fontSize: 14,
  },
  signupLink: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
});