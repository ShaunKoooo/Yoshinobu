import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";

const MyButton = ({
  isActive,
  onPress,
  title,
}: {
  isActive: boolean;
  onPress: () => void;
  title: string;
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { opacity: isActive ? 1 : 0.5 }]}
      onPress={onPress}
      disabled={!isActive}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B49162",
    borderRadius: 6,
    height: 40,
    margin: 16,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
  },
});

export default MyButton;