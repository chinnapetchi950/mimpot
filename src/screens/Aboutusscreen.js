import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import CustomHeader from "../components/CustomHeader";
import Ionicons from "react-native-vector-icons/Ionicons";
import { common } from "../styles/theme";
import { authService } from "../api/authService";
import { useTranslation } from "react-i18next";
import i18n from "../localization/i18n";
import { useDevice } from "../utils/useDeviceLayout";
import { SafeAreaView } from "react-native-safe-area-context";

const AboutusScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { ui } = useDevice();
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await authService.aboutUs();
      const fields = res?.data?.data?.fields || {};
      const currentLang = i18n.language || "en";

      // Build key dynamically → description_en / description_ar
      const descriptionKey = `description_${currentLang}`;

      let data =
        fields?.[descriptionKey]?.value ||
        fields?.description_en?.value || // fallback
        "";

      // Remove escaped slashes if any
      data = data.replace(/\\/g, "");

      setHtml(data);
    } catch (err) {
      console.log("About Us fetch error:", err);
      setHtml("<p>Error loading content</p>");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [i18n.language]);

  return (
    // <SafeAreaView style={{flex:0,backgroundColor:'#FFF'}}>
    <View style={[common.screen, { flex: 1, }]}>
      <CustomHeader
        title={t("settings.about_us")}
        showLanguage={false}
        leftComponent={
          <Ionicons
            name="arrow-back"
            size={26}
            color="#000"
            onPress={() => navigation.goBack()}
          />
        }
      />

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: ui.spacing.lg }} />
      ) : (
        <WebView
          originWhitelist={["*"]}
          javaScriptEnabled
          domStorageEnabled
          style={styles.webview}
          source={{
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body { 
                      font-size: ${ui.font.body}px; 
                      line-height: ${ui.font.body * 1.5}px; 
                      padding: ${ui.padding}px; 
                      color: #1D1D1D;
                      font-family: -apple-system, Roboto, sans-serif;
                    }
                    img { max-width: 100%; height: auto; }
                  </style>
                </head>
                <body>${html}</body>
              </html>
            `,
          }}
        />
      )}
    </View>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  webview: { flex: 1 },
});

export default AboutusScreen;
