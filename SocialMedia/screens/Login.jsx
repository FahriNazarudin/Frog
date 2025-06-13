import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { gql, useMutation } from "@apollo/client";
import { saveSecure } from "../helpers/secureStore";

const LOGIN = gql`
  mutation Login($username: String, $password: String) {
    login(username: $username, password: $password) {
      accessToken
    }
  }
`;
export default function Login() {
  const { setIsSignedIn } = useContext(AuthContext); 
  const navigation = useNavigation();
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [doLogin, { loading}] = useMutation(LOGIN)

  const handleLogin = async () => {

    try {
      const result = await doLogin({
        variables: {
          username: username,
          password: password,
        },
      });
      const token = result.data.login.accessToken;      
      await saveSecure("token", token);
      setIsSignedIn(true); 
    } catch (error) {
      console.log("Login error:", error); 
      Alert.alert("Login Error", error.message);
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
              marginTop: 90,
              fontSize: 90,
            }}
          >
            🐸
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Snakamoto"
              placeholderTextColor="#9CA3AF"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
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
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            disabled={loading}
            onPress={handleLogin}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? "loading..." : "Login"}
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
            Don't have an account?{" "}
            <Text
              style={{ color: "#06C755" }}
              onPress={() => navigation.push("Register")}
            >
              Register
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
  form: {
    marginBottom: 30,
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
    borderBottomColor: "#E5E7EB",
    color: "#111827",
    fontSize: 16,
  },
  primaryButton: {
    height: 52,
    backgroundColor: "#06C755",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "System",
  },
});
