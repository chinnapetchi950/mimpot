import React, { useState } from 'react';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';

export default function ImageWithLoader({ source, style, resizeMode = 'cover' }) {
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
        style={[StyleSheet.absoluteFillObject, style]}
        resizeMode={resizeMode}
        onLoadEnd={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    overflow: 'hidden',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
