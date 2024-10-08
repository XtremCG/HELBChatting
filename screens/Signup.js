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
import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../config/firebase";
const backImage = require("../assets/backImage.png");
import Toast from "react-native-toast-message";

export default function Register({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // Nouvelle variable pour l'image

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response); // Retourne le blob
      };
      xhr.onerror = () => {
        reject(new Error('Erreur lors de la conversion URI en Blob'));
      };
      xhr.responseType = 'blob'; // Définit la réponse comme blob
      xhr.open('GET', uri, true); // Requête GET sur l'URI
      xhr.send(null); // Envoie la requête
    });
  };

  // Fonction pour uploader l'image
  const uploadImage = async (uri) => {
    try {
      // Créer une référence dans Firebase Storage
      const imageRef = ref(storage, `profileImages/${Date.now()}.jpg`);
  
      // Convertir l'URI en blob
      const blob = await uriToBlob(uri);
  
      // Uploader l'image dans Firebase Storage
      await uploadBytes(imageRef, blob);
  
      // Obtenir l'URL de téléchargement
      const downloadURL = await getDownloadURL(imageRef);
      console.log('Image uploaded successfully! Download URL:', downloadURL);
      
      return downloadURL; // Renvoie l'URL téléchargée
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Erreur', 'Échec de l\'upload de l\'image.');
      return null; // Renvoie null en cas d'erreur
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
        console.log('Image selection canceled or no image found');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Image recovery failed.');
    }
  };
  

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
      // Création de l'utilisateur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password1);
      const user = userCredential.user;

      let photoURL = null;
      if (selectedImage) {
        photoURL = await uploadImage(selectedImage); // Upload et obtention de l'URL de l'image
      }
      console.log("Photo",photoURL);

      // Mise à jour du profil utilisateur
      await updateProfile(user, {
        displayName: username,
        photoURL: photoURL || undefined, // Ajout de l'URL de l'image si elle existe
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

        {/* Image sélectionnée */}
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
        )}

        {/* Bouton pour sélectionner l'image de profil */}
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
            Select Profile Image
          </Text>
        </TouchableOpacity>

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
