import "dotenv/config";

export default {
  expo: {
    name: "chat",
    slug: "chat",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: [
        "INTERNET",  // Permet l'accès à Internet
        "ACCESS_NETWORK_STATE",  // Permet de vérifier l'état de la connexion réseau
        "CAMERA",  // Pour l'accès à la caméra si tu en as besoin pour prendre des photos
        "READ_EXTERNAL_STORAGE",  // Lire depuis le stockage externe (galerie)
        "WRITE_EXTERNAL_STORAGE",  // Écrire dans le stockage externe (nécessaire pour Android en dessous de Q)
      ],
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
    },
  },
};
