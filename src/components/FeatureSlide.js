import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useDevice } from "../utils/useDeviceLayout";
import { colors } from "../styles/theme";

export default function FeatureSlide({ image, title, text, text2 }) {
  const { width, height, ui, deviceType } = useDevice();

  const imageHeight =
    deviceType === "tablet"
      ? height * 0.45
      : deviceType === "unfolded"
      ? height * 0.5
      : height * 0.55;

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <View style={[styles.slide, { width }]}>
        <ImageBackground
          source={image}
          style={{ width, height: imageHeight }}
          resizeMode="cover"
        />

        <View
          style={[
            styles.content,
            {
              paddingHorizontal: ui.padding,
              paddingTop: ui.spacing.lg,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                fontSize: ui.font.h2,
                marginBottom: ui.spacing.md,
              },
            ]}
          >
            {title}
          </Text>

          <Text
            style={[
              styles.text,
              {
                fontSize: ui.font.body,
                lineHeight: ui.font.body * 1.5,
              },
            ]}
          >
            {text}
          </Text>

          {!!text2 && (
            <Text
              style={[
                styles.text,
                {
                  fontSize: ui.font.body,
                  lineHeight: ui.font.body * 1.5,
                  marginTop: ui.spacing.sm,
                },
              ]}
            >
              {text2}
            </Text>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  slide: {
    alignItems: "center",
    backgroundColor: "#fff",
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
    textAlign: "center",
    color: "#1D1D1D",
  },
  text: {
    textAlign: "center",
    color: "#1D1D1D",
  },
});
