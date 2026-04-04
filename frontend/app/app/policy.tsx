import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";

import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Policy() {
  const router = useRouter();

  const [accepted, setAccepted] = useState(false);
  const [policyActive, setPolicyActive] = useState(false);

  // 🔥 FETCH POLICY STATUS
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPolicyActive(docSnap.data().policyActive);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchStatus();
  }, []);

  return (
    <ImageBackground
      // source={require("../assets/images/bg1.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.container}>

          <Text style={styles.title}>Your Insurance Plan</Text>

          {/* POLICY OVERVIEW */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>DeliCare Protection Plan 🚀</Text>
            <Text style={styles.point}>• Accident Coverage (Income Loss)</Text>
            <Text style={styles.point}>• Weekly Income Protection</Text>
            <Text style={styles.point}>• AI-based disruption detection</Text>
            <Text style={styles.point}>• Designed for gig workers</Text>
          </View>

          {/* PRICING */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pricing</Text>
            <Text style={styles.price}>₹15-50 / week</Text>
            <Text style={styles.subText}>Registration Fee: ₹50</Text>
            <Text style={styles.subText}>Reactivation Fee: ₹75</Text>
          </View>

          {/* RULES */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Policy Rules & Constraints</Text>
            <Text style={styles.point}>• Weekly premium required</Text>
            <Text style={styles.point}>• No payment for 2 weeks → deactivated</Text>
            <Text style={styles.point}>• Reactivation requires ₹75 fee</Text>
          </View>

          {/* TRIGGERS */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Trigger Rules</Text>
            <Text style={styles.point}>• Maximum 1 trigger per day</Text>
            <Text style={styles.point}>• Maximum 3 triggers per week</Text>
          </View>

          {/* PAYOUT */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Payout Conditions</Text>
            <Text style={styles.point}>• Policy must be active</Text>
            <Text style={styles.point}>• Valid disruption must be detected</Text>
            <Text style={styles.point}>• User must be active</Text>
          </View>

          {/* COVERAGE */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Coverage</Text>
            <Text style={styles.point}>• Income loss only</Text>
            <Text style={styles.point}>• No health coverage</Text>
            <Text style={styles.point}>• No vehicle damage coverage</Text>
          </View>

          {/* TERMS */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Terms & Conditions</Text>
            <Text style={styles.terms}>
              • Policy activates after payment{"\n"}
              • Claims processed based on AI validation{"\n"}
              • Fraudulent activity leads to permanent ban{"\n"}
              • Platform reserves the right to reject invalid claims
            </Text>
          </View>

          {/* CHECKBOX */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAccepted(!accepted)}
          >
            <Text style={styles.checkbox}>
              {accepted ? "☑" : "☐"}
            </Text>
            <Text style={styles.checkboxText}>
              I agree to the Terms & Conditions
            </Text>
          </TouchableOpacity>

          {/* STATUS */}
          {policyActive && (
            <Text style={{ color: "#00ff88", marginTop: 10 }}>
              Policy Already Active 
            </Text>
          )}

          {/* BUTTON */}
          <TouchableOpacity
            style={[
              styles.button,
              { opacity: accepted && !policyActive ? 1 : 0.5 },
            ]}
            disabled={!accepted || policyActive}
            onPress={() => {
              router.push("/payment?type=activation");
            }}
          >
            <Text style={styles.buttonText}>
              Activate Policy
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#222",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  point: {
    color: "#ccc",
    marginBottom: 5,
  },
  price: {
    color: "#00ffcc",
    fontSize: 24,
    fontWeight: "bold",
  },
  subText: {
    color: "#aaa",
    fontSize: 12,
  },
  terms: {
    color: "#ccc",
    fontSize: 13,
    lineHeight: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkbox: {
    color: "#fff",
    fontSize: 18,
    marginRight: 10,
  },
  checkboxText: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#ff5a5f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});