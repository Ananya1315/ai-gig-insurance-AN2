import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Payments() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const type = params.type as string;

  const [premium, setPremium] = useState<number | null>(null);
  const [loadingPremium, setLoadingPremium] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // 🔥 LOAD RAZORPAY SCRIPT (WEB ONLY)
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // 🔥 FETCH USER DATA
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  const API_KEY = "37f63416af21b6fc12124708ac26df4c";

  const tempMin = -93;
  const tempMax = 57;
  const rainMax = 200;
  const aqiMin = 1;
  const aqiMax = 5;

  const normalize = (value, min, max) => {
    let norm = (value - min) / (max - min);
    if (norm < 0) norm = 0;
    if (norm > 1) norm = 1;
    return norm;
  };

  const fetchPremium = async () => {
    try {
      setLoadingPremium(true);

      // 🌦 Step 1: Get weather
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Chennai&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherRes.json();

      const temp = weatherData.main.temp;
      const rain = weatherData.rain ? weatherData.rain["1h"] || 0 : 0;

      const lat = weatherData.coord.lat;
      const lon = weatherData.coord.lon;

      // 🌫 Step 2: Get AQI
      const aqiRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const aqiData = await aqiRes.json();

      const aqiValue = aqiData.list[0].main.aqi;

      // 📊 Step 3: Normalize
      const normTemp = normalize(temp, tempMin, tempMax);
      const normRain = normalize(rain, 0, rainMax);
      const normAqi = normalize(aqiValue, aqiMin, aqiMax);

      // ⚙️ Step 4: Get admin settings
      const adminRes = await fetch("http://192.168.137.1:3000/admin");
      const admin = await adminRes.json();
      console.log(admin);
      // 🤖 Step 5: Call prediction API
      const predRes = await fetch("http://192.168.137.1:3000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          salary: admin.salary,
          rain: normRain,
          temp: normTemp,
          aqi: normAqi,
          festival: admin.festival,
          curfew: admin.curfew,
        }),
      });

      const predData = await predRes.json();

      console.log("Final Premium:", predData);

      setPremium(predData.premium);

    } catch (error) {
      console.log("Premium error:", error);
      Alert.alert("Error", "Failed to fetch premium");
    } finally {
      setLoadingPremium(false);
    }
  };


  useEffect(() => {
    if (type === "weekly") {
      fetchPremium();
    }
  }, []);

  // 🔥 GET AMOUNT
  const getAmount = () => {
    if (type === "activation") return 200;
    if (type === "reactivation") return 250;
    if (type === "weekly") return premium || 49;
    return 0;
  };

  // 🔥 HANDLE PAYMENT (WEB RAZORPAY)
  const handlePayment = async () => {
    try {
      setProcessing(true);

      const amount = getAmount();

      const options = {
        key: "rzp_test_SZJnbRg4jIPCmT", 
        amount: amount * 100,
        currency: "INR",
        name: "Gig Insurance",
        description: "Payment",
        handler: async function () {
          const user = auth.currentUser;
          if (!user) return;

          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          let prevPaid = 0;
          if (docSnap.exists()) {
            prevPaid = docSnap.data().totalPaid || 0;
          }

          const updateData: any = {
            totalPaid: prevPaid + amount,
            lastPaymentDate: new Date(),
          };

          if (type === "activation" || type === "reactivation") {
            updateData.policyActive = true;
          }

          await setDoc(docRef, updateData, { merge: true });

          Alert.alert("Success", "Payment Successful 🎉");

          router.replace("/home");
        },
        prefill: {
          email: auth.currentUser?.email || "",
          contact: userData?.phone || "",
          name: userData?.name || "",
        },
        theme: {
          color: "#ff5a5f",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Payment</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Amount</Text>

        <Text style={styles.amount}>
          ₹
          {type === "weekly"
            ? loadingPremium
              ? "..."
              : premium || 49
            : getAmount()}
        </Text>
      </View>

      {loadingPremium && type === "weekly" && (
        <ActivityIndicator size="large" color="#fff" />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handlePayment}
        disabled={processing || loadingPremium}
      >
        {processing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Pay Now</Text>
        )}
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#222",
    padding: 25,
    borderRadius: 15,
    marginBottom: 30,
    alignItems: "center",
  },
  label: {
    color: "#aaa",
    fontSize: 16,
  },
  amount: {
    color: "#00ffcc",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#ff5a5f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});