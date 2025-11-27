import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";

import { Formik } from "formik";
import * as Yup from "yup";

import { authService } from "../api/authService";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";

const { width, height } = Dimensions.get("window");

// ---------------------
// ✅ FORM VALIDATION SCHEMA
// ---------------------
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),

  password: Yup.string()
    .min(4, "Too short!")
    .required("Password is required"),
});

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const res = await authService.login(values);

      dispatch(setUser(res.data));
      Alert.alert("Success", "Logged in successfully!");

      navigation.replace("MainTabs");
    } catch (e) {
    console.log("REGISTER ERROR:", error.response?.data || error);      
      Alert.alert("Login failed", e.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* TOP CURVED CARD */}
      <View style={styles.topRounded}>
        <View style={styles.logoCard}>
          <Image
            source={require("../assets/images/logo.png")}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.top} />

      <Text style={styles.title}>Log In</Text>

      {/* --------------------
          FORM START
      --------------------- */}
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <View style={styles.form}>
            {/* EMAIL */}
            <InputField
              placeholder="Email*"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              keyboardType="email-address"
            />

            {errors.email && touched.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            {/* PASSWORD */}
            <InputField
              placeholder="Password*"
              value={values.password}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              secureTextEntry
            />

            {errors.password && touched.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            {/* Remember & forgot */}
            <View style={styles.row}>
              <View style={styles.checkboxRow}>
                <View style={styles.checkbox} />
                <Text style={styles.smallText}>Remember me</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.smallText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 40 }} />

            <PrimaryButton
              title={isSubmitting ? "Please wait..." : "Log In"}
              onPress={handleSubmit}
              disabled={isSubmitting}
            />

            {/* SIGN UP */}
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.signup}>Sign Up</Text>
            </TouchableOpacity>

            {/* ---------- Divider ----------- */}
            <View style={styles.dividerContainer}>
              <View style={styles.line} />
              <Text style={styles.or}>OR</Text>
              <View style={styles.line} />
            </View>

            {/* Google */}
            <TouchableOpacity
              style={styles.google}
              onPress={() => Alert.alert("Google sign-in")}
            >
              <Image
                source={require("../assets/images/google.png")}
                style={styles.googleIcon}
              />
              <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  top: { alignItems: "center", paddingTop: 10 },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginTop: "70%",
  },

  form: { padding: 20 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },

  checkboxRow: { flexDirection: "row", alignItems: "center" },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#555",
  },

  smallText: { marginLeft: 8, color: "#1D1D1D", fontSize: 16 },

  signup: {
    textAlign: "center",
    color: "#1D1D1D",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 35,
  },

  line: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },

  or: { marginHorizontal: 10, color: "#9CA3AF", fontSize: 14 },

  google: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#000",
    justifyContent: "center",
  },

  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },

  googleText: { fontSize: 18 },

  error: {
    color: "red",
    fontSize: 13,
    marginTop: -8,
    marginBottom: 10,
  },

  topRounded: {
    position: "absolute",
    top: 0,
    width: width,
    height: height * 0.35,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 72,
    borderBottomRightRadius: 72,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  logoCard: {
    width: 180,
    height: 180,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
});
