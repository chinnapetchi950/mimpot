import React, { useState } from "react";
import { View, ActivityIndicator, Image, StyleSheet } from "react-native";
import { useDevice } from "../utils/useDeviceLayout";

export default function ImageWithLoader({
  source,
  style,
  resizeMode = "cover",
}) {
  const [loading, setLoading] = useState(true);

  return (
    <View style={[styles.container, style]}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" color="#999" />
        </View>
      )}

      <Image
        source={source}
        resizeMode={resizeMode}
        style={StyleSheet.absoluteFillObject}
        onLoadEnd={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',      // ✅ critical
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

