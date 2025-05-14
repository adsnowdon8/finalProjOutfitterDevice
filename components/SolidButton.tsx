import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export default function SolidButton({
  title,
  onPress,
  disabled,
  color,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  color: "green" | "blue";
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && styles.pressed,
        color === "blue"
          ? { backgroundColor: "#3B82F6" }
          : { backgroundColor: "#10B981" },
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    // backgroundColor: "#007AFF", // iOS blue
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: 300,
    height: 150,
  },
  text: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    backgroundColor: "#A0A0A0",
  },
});
