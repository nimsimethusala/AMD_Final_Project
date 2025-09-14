import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUp } from "@/services/authService";

// ===== Validation Schema =====
const schema = yup.object().shape({
  username: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Signup = () => {
  const router = useRouter();

  const { control, handleSubmit, formState: { errors, isSubmitting }} = useForm({ resolver: yupResolver(schema)});

  const onSubmit = async (data: any) => {
    try {
      const uid = await signUp(data.username, data.email, data.password);
      console.log("User created:", uid);
      router.push("/login");
    } catch (error: any) {
      console.error("Signup error:", error.message);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/landing/authImage.jpeg")}
      style={{ flex: 1, width: "100%", height: "100%" }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Create an Account</Text>

          {/* Username */}
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Name"
                placeholderTextColor="#ffffff"
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />
          {errors.username && (
            <Text style={styles.error}>{errors.username.message}</Text>
          )}

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Email"
                placeholderTextColor="#ffffff"
                value={value}
                onChangeText={onChange}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            )}
          />
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}

          {/* Password */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Password"
                placeholderTextColor="#ffffff"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                style={styles.input}
              />
            )}
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password.message}</Text>
          )}

          <TouchableOpacity
            disabled={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? "Creating..." : "Signup"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    backgroundColor: "rgba(3, 227, 252,0.25)",
    height: "75%",
    width: "90%",
    borderRadius: 40,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: "#001a19",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  input: {
    backgroundColor: "rgba(3, 179, 255, 0.5)",
    borderRadius: 10,
    padding: 12,
    marginTop: 15,
    width: "95%",
    color: "#fff",
    borderColor: "#fff",
    borderWidth: 0.5,
  },
  error: { color: "red", fontSize: 12, marginTop: 5 },
  button: {
    backgroundColor: "#001414",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 15,
    marginTop: 40,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
