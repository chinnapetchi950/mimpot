import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/theme';
import { useDevice } from '../utils/useDeviceLayout';

export default function PrimaryButton({ title, onPress, style }) {
  const { ui } = useDevice();

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          paddingVertical: 14,
          borderRadius: 28,
          marginTop: ui.spacing.md,
        },
        style,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessible
    >
      <Text
        style={[
          styles.text,
          { fontSize: ui.button.fontSize },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '700',
  },
});
