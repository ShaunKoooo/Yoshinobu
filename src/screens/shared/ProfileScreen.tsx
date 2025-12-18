import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import {
  MyButton,
  MyListItem,
} from 'src/components';
import { useAppDispatch } from 'src/store/hooks';
import { Colors } from 'src/theme';
import { logout } from 'src/store/slices/authSlice';
import { useInitializeUser } from 'src/hooks';

const PROFILE_FIELDS = [
  {
    key: 'nick_name',
    label: '姓名',
  },
  {
    key: 'email',
    label: '電子郵件',
  },
  {
    key: 'id',
    label: '用戶ID',
  },
]

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error, profile } = useInitializeUser();

  const renderProfileItem = ({ item }) => {
    const { label, key } = item || {};
    const value = profile?.[key] || '-';

    return (
      <View style={styles.profileItem}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    )
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>載入中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>載入失敗: {String(error)}</Text>
        <MyButton
          title="登出"
          isActive
          onPress={() => {
            dispatch(logout());
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <MyListItem
          data={PROFILE_FIELDS}
          renderItem={renderProfileItem}
          keyExtractor={item => item.key}
        />
      </View>

      <View style={styles.buttonContainer}>
        <MyButton
          title="登出"
          isActive
          onPress={() => {
            dispatch(logout());
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    padding: 16,
    minHeight: 60,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#48484A',
  },
  value: {
    fontSize: 16,
    color: '#8E8E93',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
});

export default ProfileScreen;
