import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        let isActive = data.policyActive;

        // 🔥 EXPIRY LOGIC
        if (data.lastPaymentDate) {
          const lastDate = data.lastPaymentDate.toDate
            ? data.lastPaymentDate.toDate()
            : new Date(data.lastPaymentDate);

          const now = new Date();

          const diffDays =
            (now.getTime() - lastDate.getTime()) /
            (1000 * 60 * 60 * 24);

         if (diffDays > 14) {
  isActive = false;
  await setDoc(
    doc(db, "users", user.uid),
    { policyActive: false },
    { merge: true }
  );
}
        }

        setUserData({
          ...data,
          policyActive: isActive,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  return (
    <ImageBackground
      source={require("../assets/images/bg1.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>

          <Text style={styles.title}>Welcome 👋</Text>

          {/* POLICY STATUS */}
          <View style={styles.card}>
            <Text style={styles.label}>Policy Status</Text>
            <Text style={styles.value}>
              {userData?.policyActive ? "Active ✅" : "Inactive ❌"}
            </Text>
          </View>

          {/* TOTAL PAID */}
          <View style={styles.card}>
            <Text style={styles.label}>Total Paid</Text>
            <Text style={styles.value}>
              ₹{userData?.totalPaid || 0}
            </Text>
          </View>

          {/* CREDITS */}
          <View style={styles.card}>
            <Text style={styles.label}>Credits</Text>
            <Text style={styles.value}>0</Text>
          </View>

          {/* NEXT PREMIUM */}
          <View style={styles.card}>
            <Text style={styles.label}>Next Premium</Text>
            <Text style={styles.value}>₹49 (Next Week)</Text>
          </View>

          {/* 🔥 WEEKLY PAYMENT BUTTON */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/payment?type=weekly")}
          >
            <Text style={styles.buttonText}>
              Pay Weekly Premium
            </Text>
          </TouchableOpacity>

          {/* 🔥 POLICY DETAILS BUTTON */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#444" }]}
            onPress={() => router.push("/policy")}
          >
            <Text style={styles.buttonText}>
              View Policy
            </Text>
          </TouchableOpacity>
          {!userData?.policyActive && (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: "#ffaa00" }]}
    onPress={() => router.push("/payment?type=reactivation")}
  >
    <Text style={styles.buttonText}>
      Reactivate Policy (₹250)
    </Text>
  </TouchableOpacity>
)}

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
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  label: {
    color: "#aaa",
    fontSize: 14,
  },
  value: {
    color: "#00ffcc",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#ff5a5f",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});