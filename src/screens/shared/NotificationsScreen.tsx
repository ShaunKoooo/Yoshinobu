import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import { Colors } from 'src/theme';
import { RootState, AppDispatch } from 'src/store';
import { fetchNotifications, markRead, markAllRead } from 'src/store/slices/notificationSlice';
import { NotificationItem } from 'src/components/NotificationItem';
import { Notification } from 'src/services/api/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const {
    notifications,
    refreshing,
    loading,
    loadMoreing,
    endReached
  } = useSelector((state: RootState) => state.notification);

  // Initial Load
  useEffect(() => {
    dispatch(fetchNotifications({ newer: true }));
  }, [dispatch]);

  // Set Header Right (Read All)
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={styles.headerRightText} onPress={() => dispatch(markAllRead())}>
          全部已讀
        </Text>
      ),
    });
  }, [navigation, dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchNotifications({ newer: true }));
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (!endReached && !loadMoreing && !loading) {
      dispatch(fetchNotifications({ older: true }));
    }
  }, [dispatch, endReached, loadMoreing, loading]);

  const handleItemPress = useCallback((item: Notification) => {
    if (!item.read) {
      dispatch(markRead([item.id]));
    }

    // Navigation Logic based on type
    console.log('Navigate to:', item.record_type, item.record_id);
  }, [dispatch]);

  const renderItem = useCallback(({ item }: { item: Notification }) => (
    <NotificationItem item={item} onPress={handleItemPress} />
  ), [handleItemPress]);

  const renderFooter = () => {
    if (!loadMoreing) return <View style={{ height: 20 }} />;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading && notifications.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }
    return (
      <View style={styles.centerContainer}>
        <Icon name="bell-sleep-outline" size={64} color="#CCC" />
        <Text style={styles.emptyText}>目前沒有新通知</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={notifications}
        renderItem={renderItem}
        estimatedItemSize={80}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
  headerRightText: {
    color: Colors.primary,
    fontSize: 16,
    marginRight: 16,
    fontWeight: '600',
  }
});

export default NotificationsScreen;
