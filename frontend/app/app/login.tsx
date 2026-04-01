import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
} from "react-native";

import { useRouter } from "expo-router";
import { useState } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);

      Alert.alert("Success", "Login successful");

      // later we will redirect to dashboard
      router.replace("/policy");

    } catch (error: any) {
      console.log(error);

      if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "User not found");
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "Incorrect password");
      } else {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg1.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* BACK */}
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>⬅</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Login</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
  },
  container: {
    padding: 20,
  },
  back: {
    color: "#fff",
    marginBottom: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#ff5a5f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});