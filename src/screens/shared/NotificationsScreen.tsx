import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MyListItem } from 'src/components';
import { Colors } from 'src/theme';

// 通知類型
interface Notification {
  id: number;
  type: 'course_verified' | 'booking_reminder' | 'cancellation';
  title: string;
  details: string;
  timestamp: string;
  avatarUrl?: string;
  isRead: boolean;
}

// 模擬通知資料
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'course_verified',
    title: '按摩師 Sunny 已核銷課程',
    details: '2025-09-30(週日) 14:30 專業徒手-深層調理1堂 (60分鐘)',
    timestamp: '1分鐘前',
    avatarUrl: 'https://via.placeholder.com/48',
    isRead: false,
  },
  {
    id: 2,
    type: 'booking_reminder',
    title: '預約提醒',
    details: '您有一個預約在明天 10:00',
    timestamp: '2小時前',
    avatarUrl: 'https://via.placeholder.com/48',
    isRead: false,
  },
  {
    id: 3,
    type: 'cancellation',
    title: '預約已取消',
    details: '2025-10-01(週一) 15:00 的預約已取消',
    timestamp: '1天前',
    avatarUrl: 'https://via.placeholder.com/48',
    isRead: true,
  },
];

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  const handleNotificationPress = (id: number) => {
    // 標記為已讀
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    // TODO: 導航到詳細頁面
  };

  return (
    <View style={styles.container}>
      {/* 通知列表 */}
      <View style={styles.listContainer}>
        <MyListItem
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: notification }) => (
            <TouchableOpacity
              style={[
                styles.notificationItem,
                !notification.isRead && styles.unreadItem,
              ]}
              onPress={() => handleNotificationPress(notification.id)}
            >
              {/* Avatar */}
              <View style={{ flexDirection: 'row', marginRight: 30 }}>
                <Image
                  source={{ uri: notification.avatarUrl }}
                  style={styles.avatar}
                />
                <View style={{ marginTop: 5, paddingRight: 16 }}>
                  <Text style={styles.title}>
                    {notification.title}
                  </Text>
                  <Text style={styles.details}>
                    {notification.details}
                  </Text>
                </View>
              </View>

              {/* Content */}
              <View style={styles.contentContainer}>
                <Text style={styles.timestamp}>{notification.timestamp}</Text>
              </View>
            </TouchableOpacity>
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#000000',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  markAllReadText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  listContainer: {
    flex: 1,
  },
  notificationItem: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    height: 120,
  },
  unreadItem: {
    backgroundColor: '#E6EEEE',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 100,
    marginRight: 12,
  },
  contentContainer: {
    height: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 4,
    flexShrink: 1,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 12,
    paddingBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 8,
    marginTop: 6,
  },
});

export default NotificationsScreen;
