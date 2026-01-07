import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import CustomHeader from "../components/CustomHeader";
import Ionicons from "react-native-vector-icons/Ionicons";
import { common } from "../styles/theme";
import { authService } from "../api/authService";
import { useTranslation } from "react-i18next";
import i18n from "../localization/i18n";
import { getLocalizedValue } from "../utils/localization";

const AboutusScreen = ({ navigation }) => {
  const { t } = useTranslation();
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

    console.log(data, res?.data, "about us data");

    // Remove escaped slashes if any
    data = data.replace(/\\/g, "");

    setHtml(data);
      // Remove escaped slashes if any
      // data = data.replace(/\\/g, "");

      // setHtml(data);
    } catch (err) {
      setHtml("<p>Error loading content</p>");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    fetchData();
  }, [i18n.language]);

  return (
    <View style={[common.screen, { flex: 1 }]}>
      <CustomHeader
        title={t('settings.about_us')}
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
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <WebView
          originWhitelist={["*"]}
          javaScriptEnabled
          domStorageEnabled
          style={{ flex: 1 }}
          source={{
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-size:16px; padding:16px; line-height:24px;">
                  ${html}
                </body>
              </html>
            `,
          }}
        />
      )}
    </View>
  );
};

export default AboutusScreen;
