import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";

import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function Home() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [payslipUploaded, setPayslipUploaded] = useState(false);
  const [credits, setCredits] = useState<number>(0);

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
              (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

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
          setCredits(data.credits || 0);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🌍 REAL ENVIRONMENT API (CHENNAI)
  const fetchEnvData = async () => {
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Chennai&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherRes.json();

      const temp = weatherData.main.temp;
      const rain = weatherData.rain ? weatherData.rain["1h"] || 0 : 0;
      const lat = weatherData.coord.lat;
      const lon = weatherData.coord.lon;

      const aqiRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const aqiData = await aqiRes.json();

      const aqi = aqiData.list[0].main.aqi * 50;

      return { rain, temperature: temp, aqi };
    } catch (error) {
      console.log("Env error:", error);
      return { rain: 0, temperature: 30, aqi: 50 };
    }
  };

  // 🧑‍💻 ADMIN DATA
  const fetchAdminData = async () => {
    const res = await fetch("http://192.168.137.1:3000/admin");
    return await res.json();
  };

  // 🔥 AUTOMATIC DAILY TRIGGER
  useEffect(() => {
    const runDailyTrigger = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) return;

        const data = snap.data();
        const lastTrigger = data.lastTriggerDate
          ? new Date(data.lastTriggerDate.seconds * 1000)
          : null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const isAlreadyTriggeredToday =
          lastTrigger && lastTrigger.setHours(0, 0, 0, 0) === today.getTime();

        if (isAlreadyTriggeredToday) {
          console.log("Trigger already run today");
          setCredits(data.credits || 0);
          return;
        }

        const env = await fetchEnvData();
        const admin = await fetchAdminData();

        let payouts: number[] = [];
        let reasons: string[] = [];

        if (env.rain >= 80 && env.rain <= 100) {
          payouts.push(23);
          reasons.push("Moderate Rain");
        }
        if (env.rain > 100) {
          payouts.push(45);
          reasons.push("Heavy Rain");
        }
        if (env.temperature > 45) {
          payouts.push(32);
          reasons.push("Extreme Heat");
        }
        if (env.aqi > 150) {
          payouts.push(32);
          reasons.push("High Pollution");
        }
        if (admin.curfew === 1) {
          payouts.push(45);
          reasons.push("Curfew");
        }
        if (admin.festival === 1) {
          payouts.push(23);
          reasons.push("Festival");
        }

        if (payouts.length === 0) {
          console.log("No trigger conditions today");
          return;
        }

        const finalPayout = Math.max(...payouts);
        const newCredits = (data.credits || 0) + finalPayout;

        await setDoc(
          userRef,
          { credits: newCredits, lastTriggerDate: new Date() },
          { merge: true }
        );

        setCredits(newCredits);

        console.log(
          `Trigger activated automatically: ${reasons.join(
            ", "
          )} → ₹${finalPayout} added`
        );
      } catch (err) {
        console.log("Automatic trigger error:", err);
      }
    };

    runDailyTrigger();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob, "payslip.jpg");

      try {
        const res = await axios.post(
          "http://192.168.137.1:3000/upload-payslip",
          formData
        );

        setPayslipUploaded(true);
        setUserData((prev: any) => ({
          ...prev,
          salary: res.data.salary,
        }));
      } catch (err) {
        console.log("UPLOAD ERROR:", err);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/images/bg1.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome 👋</Text>

          {/* UPLOAD */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#007bff" }]}
            onPress={pickImage}
          >
            <Text style={styles.buttonText}>
              {payslipUploaded ? "Payslip Uploaded ✅" : "Upload Payslip"}
            </Text>
          </TouchableOpacity>

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
            <Text style={styles.value}>₹{userData?.totalPaid || 0}</Text>
          </View>

          {/* CREDITS */}
          <View style={styles.card}>
            <Text style={styles.label}>Credits</Text>
            <Text style={styles.value}>{credits}</Text>
          </View>

          {/* PAYMENT */}
          <TouchableOpacity
            style={[styles.button, { opacity: payslipUploaded ? 1 : 0.5 }]}
            onPress={() => {
              if (!payslipUploaded) {
                alert("Upload payslip first!");
                return;
              }

              router.push({
                pathname: "/payment",
                params: {
                  type: "weekly",
                  salary: userData?.salary,
                },
              });
            }}
          >
            <Text style={styles.buttonText}>Pay Weekly Premium</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#333" }]}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          {/* 🔥 POLICY DETAILS BUTTON */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#444" }]}
            onPress={() => router.push("/policy")}
          >
            <Text style={styles.buttonText}>View Policy</Text>
          </TouchableOpacity>
        </View>

        {!userData?.policyActive && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#ffaa00" }]}
            onPress={() => router.push("/payment?type=reactivation")}
          >
            <Text style={styles.buttonText}>Reactivate Policy (₹250)</Text>
          </TouchableOpacity>
        )}
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