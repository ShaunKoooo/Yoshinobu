import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { DateRangePicker, Icon, MyListItem, Badge } from 'src/components';
import { Colors } from 'src/theme';
import type { BadgeVariant } from 'src/components/common/Badge';

// 預約狀態類型
type BookingStatus = 'reserved' | 'pending_verification' | 'completed' | 'cancelled';

// 預約資料類型
interface Booking {
  id: number;
  date: string;
  time: string;
  customerName: string;
  service: string;
  duration: string;
  providerName: string;
  providerAvatar?: string;
  status: BookingStatus;
}

// 狀態標籤配置
const STATUS_TABS = [
  { key: 'reserved', label: '已預約', count: 3 },
  { key: 'pending_verification', label: '會員待核銷', count: 1 },
  { key: 'completed', label: '已完成', count: 0 },
  { key: 'cancelled', label: '已取消', count: 0 },
] as const;

// 模擬資料
const MOCK_BOOKINGS: Booking[] = [
  {
    id: 1,
    date: '2025-09-30',
    time: '14:30',
    customerName: '林雅婷',
    service: '專業徒手-深層調理',
    duration: '1堂(60分鐘)',
    providerName: 'Sunny',
    status: 'reserved',
  },
  {
    id: 2,
    date: '2025-09-30',
    time: '15:00',
    customerName: '王美玲',
    service: '專業徒手-美式徒手',
    duration: '1堂(60分鐘)',
    providerName: 'Yvonne',
    status: 'reserved',
  },
  {
    id: 3,
    date: '2025-10-08',
    time: '20:00',
    customerName: '林雅婷',
    service: '專業徒手-美式油壓',
    duration: '1堂(60分鐘)',
    providerName: 'Sunny',
    status: 'reserved',
  },
];

const CourseManagementScreen = () => {
  const [startDate, setStartDate] = useState(new Date('2025-09-30'));
  const [endDate, setEndDate] = useState(new Date('2025-10-08'));
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>('reserved');
  const [showAllStatuses, setShowAllStatuses] = useState(false);

  const filteredBookings = MOCK_BOOKINGS.filter(
    (booking) => showAllStatuses || booking.status === selectedStatus
  );

  const formatDateRange = () => {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    return `${start} – ${end}`;
  };

  const getWeekday = (dateStr: string) => {
    const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    const date = new Date(dateStr);
    return weekdays[date.getDay()];
  };

  const getStatusBadge = (status: BookingStatus): { variant: BadgeVariant; text: string } => {
    switch (status) {
      case 'reserved':
        return { variant: 'reserved', text: '已預約' };
      case 'pending_verification':
        return { variant: 'memberPending', text: '會員待核銷' };
      case 'completed':
        return { variant: 'completed', text: '已完成' };
      case 'cancelled':
        return { variant: 'canceled', text: '已取消' };
    }
  };

  return (
    <View style={styles.container}>
      {/* 日期範圍選擇器 */}
      <View style={styles.dateRangeContainer}>
        <TouchableOpacity style={styles.dateRangeButton}>
          <Icon name="clock" size={18} color={Colors.text.primary} />
          <Text style={styles.dateRangeText}>{formatDateRange()}</Text>
        </TouchableOpacity>

        {/* 全部下拉選單 */}
        <TouchableOpacity style={styles.dropdownButton}>
          <Icon name="down-dir" size={16} color={Colors.text.primary} />
          <Text style={styles.dropdownText}>全部</Text>
        </TouchableOpacity>
      </View>

      {/* 狀態篩選標籤 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {STATUS_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              selectedStatus === tab.key && styles.tabActive,
            ]}
            onPress={() => {
              setSelectedStatus(tab.key as BookingStatus);
              setShowAllStatuses(false);
            }}
          >
            <Text
              style={[
                styles.tabText,
                selectedStatus === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
              {tab.count > 0 && `(${tab.count})`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 預約列表 */}
      <View style={styles.listContainer}>
        <MyListItem
          data={filteredBookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: booking }) => (
            <View style={styles.bookingCard}>
              {/* 日期時間和狀態 */}
              <View style={styles.cardHeader}>
                <Text style={styles.dateTimeText}>
                  {booking.date.replace(/-/g, '-')}
                  {getWeekday(booking.date)} {booking.time}
                </Text>
                <Badge
                  variant={getStatusBadge(booking.status).variant}
                  text={getStatusBadge(booking.status).text}
                />
              </View>

              {/* 客戶姓名 */}
              <Text style={styles.customerName}>{booking.customerName}</Text>

              {/* 服務項目 */}
              <Text style={styles.serviceText}>{booking.service}</Text>

              {/* 時長和教練 */}
              <View style={styles.providerRow}>
                <Text style={styles.durationText}>{booking.duration}</Text>
                <View style={styles.providerInfo}>
                  <Image
                    source={{ uri: 'https://via.placeholder.com/24' }}
                    style={styles.providerAvatar}
                  />
                  <Text style={styles.providerName}>{booking.providerName}</Text>
                </View>
              </View>

              {/* 操作按鈕 */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>取消預約</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.verifyButton}>
                  <Text style={styles.verifyButtonText}>員工核銷</Text>
                </TouchableOpacity>
              </View>
            </View>
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
  // 日期範圍
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 91,
    marginRight: 8,
  },
  dateRangeText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  dropdownButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 91,
  },
  dropdownText: {
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  // 狀態標籤
  tabsContainer: {
    flexGrow: 0,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: 'transparent',
    borderColor: '#D1D4D9',
    borderWidth: 1,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  // 預約列表
  listContainer: {
    flex: 1,
    padding: 16,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateTimeText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 14,
    marginBottom: 8,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  durationText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  providerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginLeft: 4,
  },
  providerName: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  // 操作按鈕
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  verifyButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default CourseManagementScreen;
