import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Profile() {
  const [data, setData] = useState<any>({});

  const fetchProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));

    if (snap.exists()) {
      setData(snap.data());
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await setDoc(
      doc(db, "users", user.uid),
      data,
      { merge: true }
    );

    Alert.alert("Saved", "Profile updated successfully");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <TextInput
        placeholder="Aadhaar"
        style={styles.input}
        value={data.aadhaar}
        onChangeText={(t) => setData({ ...data, aadhaar: t })}
      />

      <TextInput
        placeholder="Nominee Name"
        style={styles.input}
        value={data.nominee}
        onChangeText={(t) => setData({ ...data, nominee: t })}
      />

      <TextInput
        placeholder="Nominee Email"
        style={styles.input}
        value={data.nomineeEmail}
        onChangeText={(t) => setData({ ...data, nomineeEmail: t })}
      />

      <TextInput
        placeholder="Nominee Relation"
        style={styles.input}
        value={data.nomineeRelation}
        onChangeText={(t) =>
          setData({ ...data, nomineeRelation: t })
        }
      />

      <TextInput
        placeholder="Company"
        style={styles.input}
        value={data.company}
        onChangeText={(t) => setData({ ...data, company: t })}
      />

      <TextInput
        placeholder="Salary"
        style={styles.input}
        value={String(data.salary || "")}
        onChangeText={(t) =>
          setData({ ...data, salary: Number(t) })
        }
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#ff5a5f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});