import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";

const REGISTER = gql`
  mutation Register(
    $name: String
    $username: String
    $email: String
    $password: String
  ) {
    register(
      name: $name
      username: $username
      email: $email
      password: $password
    )
  }
`;

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [doRegister, { loading }] = useMutation(REGISTER);

  const handleRegister = async () => {

    try {
      console.log("🚀 Register started with:", { name, username, email });

      const result = await doRegister({
        variables: {
          name: name,
          username: username,
          email: email,
          password: password,
        },
      });

      console.log("Register :", result);
      Alert.alert(result.data.register);
      navigation.push("Login");
    } catch (error) {
      console.log(error);
      Alert.alert(error.message)
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text
            style={{
              color: "#06C755",
              marginTop: 70,
              fontSize: 90,
            }}
          >
            🐸
          </Text>
        </View>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}> Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Satoshi"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Snakamoto"
              placeholderTextColor="#9CA3AF"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="satoshinakamoto@mail.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="R3eh8sdi"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            disabled={loading}
            onPress={handleRegister}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? "loading..." : "Register"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "System",
              marginTop: 20,
              textAlign: "center",
            }}
          >
            already have an account?{" "}
            <Text
              style={{ color: "#06C755" }}
              onPress={() => navigation.push("Login")}
            >
              Login
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    color: "#111827",
  },
  primaryButton: {
    height: 52,
    backgroundColor: "#06C755",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "System",
  },
});
