import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const NotificationsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>通知</Text>
      <Text style={styles.subtitle}>Notifications</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default NotificationsScreen;
