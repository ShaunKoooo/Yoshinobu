import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MyButton } from 'src/components';
import { useAppDispatch } from 'src/store/hooks';
import { logout } from 'src/store/slices/authSlice';

const ProfileScreen = () => {
  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      <MyButton
        title="登出"
        isActive
        onPress={() => {
          dispatch(logout());
        }} />
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

export default ProfileScreen;
