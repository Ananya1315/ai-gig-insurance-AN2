import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    company: "",
    nominee: "",
    aadhaar: "",
  });

  const [companyId, setCompanyId] = useState<any>(null);
  const [payslip, setPayslip] = useState<any>(null);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const pickDocument = async (type: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (result.assets) {
        if (type === "companyId") {
          setCompanyId(result.assets[0]);
        } else {
          setPayslip(result.assets[0]);
        }
      }
    } catch (error) {
      console.log("Error picking file:", error);
    }
  };

  const handleRegister = () => {
    const { name, phone, email, password, company, nominee, aadhaar } = form;

    if (!name || !phone || !email || !password || !company || !nominee || !aadhaar) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (!companyId || !payslip) {
      Alert.alert("Error", "Please upload Company ID and Payslip");
      return;
    }

    console.log("REGISTER DATA:", {
      ...form,
      companyId,
      payslip,
    });

    Alert.alert("Success", "Registered Successfully ");

    router.replace("/login");
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg1.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.container}>

          {/* BACK */}
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>⬅</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Register </Text>

          {/* INPUTS */}
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#aaa"
            style={styles.input}
            onChangeText={(text) => handleChange("name", text)}
          />

          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#aaa"
            style={styles.input}
            keyboardType="phone-pad"
            onChangeText={(text) => handleChange("phone", text)}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#aaa"
            style={styles.input}
            onChangeText={(text) => handleChange("email", text)}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            style={styles.input}
            onChangeText={(text) => handleChange("password", text)}
          />

          <TextInput
            placeholder="Company (Swiggy/Zomato)"
            placeholderTextColor="#aaa"
            style={styles.input}
            onChangeText={(text) => handleChange("company", text)}
          />
          <TextInput
            placeholder="Aadhaar Number"
            placeholderTextColor="#aaa"
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(text) => handleChange("aadhaar", text)}
          />
          <TextInput
            placeholder="Nominee Name"
            placeholderTextColor="#aaa"
            style={styles.input}
            onChangeText={(text) => handleChange("nominee", text)}
          />
          <TextInput
            placeholder="Nominee relation"
            placeholderTextColor="#aaa"
            style={styles.input}
            onChangeText={(text) => handleChange("nominee", text)}
          />
          <TextInput
            placeholder="Nominee's Email"
            placeholderTextColor="#aaa"
            style={styles.input}
            onChangeText={(text) => handleChange("email", text)}
          />
          {/* COMPANY ID */}
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickDocument("companyId")}
          >
            <Text style={styles.buttonText}>Upload Company ID</Text>
          </TouchableOpacity>

          {companyId && (
            <Text style={styles.fileText}>{companyId.name} ✅</Text>
          )}

          {/* PAYSLIP */}
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickDocument("payslip")}
          >
            <Text style={styles.buttonText}>Upload Payslip</Text>
          </TouchableOpacity>

          {payslip && (
            <Text style={styles.fileText}>{payslip.name} ✅</Text>
          )}

          {/* SUBMIT */}
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Submit</Text>
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
  uploadButton: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  fileText: {
    color: "#aaa",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#ff5a5f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});