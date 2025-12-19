import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from 'src/theme';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>首頁</Text>
      <Text style={styles.text}>歡迎使用</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default HomeScreen;
