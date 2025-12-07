import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContractManagementTab = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>合約管理</Text>
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

export default ContractManagementTab;
