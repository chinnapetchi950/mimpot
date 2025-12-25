import React, { useEffect, useState } from "react";
import { View, ActivityIndicator,TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import CustomHeader from "../components/CustomHeader";
import Ionicons from "react-native-vector-icons/Ionicons";
import { common } from "../styles/theme";
import { authService } from "../api/authService";
import { useTranslation } from "react-i18next";

const TermsScreen = ({ navigation }) => {
  const { t } = useTranslation();
 
 const [html, setHtml] = useState("");
   const [loading, setLoading] = useState(true);
 
   const fetchData = async () => {
     try {
       const res = await authService.terms();
       console.log("res------------------->,",res);
       
       let data = res?.data?.data?.fields?.description?.value || "";
 
       // Remove escaped slashes if any
       data = data.replace(/\\/g, "");
 
       setHtml(data);
     } catch (err) {
      console.log("reresr",err);
      
       setHtml("<p>Error loading content</p>");
     } finally {
       setLoading(false);
     }
   };
 
   useEffect(() => {
     fetchData();
   }, []);

  return (
    <View style={common.screen}>
<CustomHeader
  title={t('settings.terms_and_conditions')}
rightComponent={<TouchableOpacity></TouchableOpacity>}
  leftComponent={
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={26} color="#000" />
    </TouchableOpacity>
   
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

export default TermsScreen;
