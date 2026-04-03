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

  // 🔥 FETCH AI PREMIUM (ONLY FOR WEEKLY)
  const fetchPremium = async () => {
    try {
      setLoadingPremium(true);

      const response = await fetch("http://172.20.10.4/getPremium");
      const data = await response.json();

      setPremium(data.premium);

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

  // 🔥 HANDLE PAYMENT
  const handlePayment = async () => {
    try {
      setProcessing(true);

      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      let prevPaid = 0;
      if (docSnap.exists()) {
        prevPaid = docSnap.data().totalPaid || 0;
      }

      const amount = getAmount();

      const updateData: any = {
        totalPaid: prevPaid + amount,
        lastPaymentDate: new Date(),
      };

      if (type === "activation" || type === "reactivation") {
        updateData.policyActive = true;
      }

      await setDoc(docRef, updateData, { merge: true });

      Alert.alert("Success", "Payment Successful");

      router.replace("/home");

    } catch (error: any) {
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

      {/* 🔥 LOADING STATE */}
      {loadingPremium && type === "weekly" && (
        <ActivityIndicator size="large" color="#fff" />
      )}

      {/* 🔥 PAY BUTTON */}
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
})