import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BasicInfoTab = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>基本資料</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 16,
    color: '#000000',
  },
});

export default BasicInfoTab;
