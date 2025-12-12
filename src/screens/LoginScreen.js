import React, { useEffect, useState } from "react";
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
import { setToken, setUser } from "../store/userSlice";
import Storage from "../utils/storage";
import Feather from "react-native-vector-icons/Feather";

const { width, height } = Dimensions.get("window");

// ---------------------
// VALIDATION
// ---------------------
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(4, "Too short!").required("Password is required"),
});

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();

  const [rememberMe, setRememberMe] = useState(false);
  const [initialEmail, setInitialEmail] = useState("");
  const [initialPassword, setInitialPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);

  // -----------------------
  // ✅ LOAD REMEMBERED LOGIN
  // -----------------------
  useEffect(() => {
    const loadSavedCredentials = async () => {
      const savedEmail = await Storage.getItem("saved_email");
      const savedPassword = await Storage.getItem("saved_password");

      if (savedEmail && savedPassword) {
        setInitialEmail(savedEmail);
        setInitialPassword(savedPassword);
        setRememberMe(true);
      }
    };
    loadSavedCredentials();
  }, []);

  // -----------------------
  // LOGIN API
  // -----------------------
  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const res = await authService.login(values);

      const token = res.data?.data?.access_token;
      const userData = res.data?.data;

      Storage.setItem("token", token);
      Storage.setItem("userData", userData);

      // Save credentials if RememberMe is ON
      if (rememberMe) {
        Storage.setItem("saved_email", values.email);
        Storage.setItem("saved_password", values.password);
      } else {
        Storage.removeItem("saved_email");
        Storage.removeItem("saved_password");
      }

      dispatch(setUser(userData));
      dispatch(setToken(token));

      Alert.alert("Success", "Logged in successfully!");
      navigation.replace("MainTabs");
    } catch (e) {
      console.log("Login ERROR:", e.response || e);
      Alert.alert("Login failed", e.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top design */}
      <View style={styles.topRounded}>
        <View style={styles.logoCard}>
          <Image source={require("../assets/images/logo.png")} resizeMode="cover" />
        </View>
      </View>

      <View style={styles.top} />

      <Text style={styles.title}>Log In</Text>

      <Formik
        initialValues={{ email: initialEmail, password: initialPassword }}
        enableReinitialize
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
  secureTextEntry={!showPassword} // toggle secureTextEntry
  rightIcon={{
    name: showPassword ? "eye-off" : "eye",
    onPress: () => setShowPassword(!showPassword),
  }}
/>
            {errors.password && touched.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            {/* Remember me */}
            <View style={styles.row}>
              {/* <TouchableOpacity
  onPress={() => setRememberMe(!rememberMe)}
  style={styles.checkboxRow}
>
  <Feather
    name={rememberMe ? "check-square" : "square"}
    size={22}
    color={"#000"}
  />
  <Text style={styles.smallText}>Remember me</Text>
</TouchableOpacity> */}
              <TouchableOpacity
  onPress={() => setRememberMe(!rememberMe)}
  style={styles.checkboxRow}
>
  <View
    style={[
      styles.checkbox,
      rememberMe && styles.checkboxChecked, // Apply fill color when checked
    ]}
  >
    {rememberMe&&
    <Feather
      name={"check"}
      size={19}
      color={"#fff"} 
    
    />
}
  </View>

  <Text style={styles.smallText}>Remember me</Text>
</TouchableOpacity>

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

            {/* Divider */}
           <View style={styles.dividerContainer}> <View style={styles.line} /> <Text style={styles.or}>OR</Text> <View style={styles.line} /> </View>

            {/* Google */}
            <TouchableOpacity
              style={styles.google}
              onPress={() => Alert.alert("Google login")}
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
  title: { fontSize: 28, fontWeight: "700", textAlign: "center", marginTop: "70%" },
  form: { padding: 20 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },

  checkboxRow: { flexDirection: "row", alignItems: "center" },

  checkbox: {
    // width: 20,
    // height: 20,
    // borderWidth: 1,
    // borderRadius: 4,
    borderColor: "#555",
     width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    //borderColor: "#42B5E8",      // Primary color border
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxChecked: {
    backgroundColor: "#1D9BF0",
    borderColor: "#1D9BF0",
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

  googleIcon: { width: 24, height: 24, marginRight: 8 },
  googleText: { fontSize: 18 },
  error: { color: "red", fontSize: 13, marginTop: -8, marginBottom: 10 },

  topRounded: {
    position: "absolute",
    top: 0,
    width,
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
    checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#42B5E8",      // Primary color border
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxBoxChecked: {
    backgroundColor: "#42B5E8",  // Primary fill color when checked
    borderColor: "#42B5E8",
  },

  smallText: {
    marginLeft: 8,
    color: "#1D1D1D",
    fontSize: 16,
  },
  },
});
