import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors } from 'src/theme';
import { useContractVisits, useCancelContractVisit } from 'src/services/hooks';
import { MyAlert } from 'src/components';
import type { ContractVisit } from 'src/services/api/types';
import { useInitializeUser } from 'src/hooks/useInitializeUser';

type BookingStatus = 'reserved' | 'completed' | 'cancelled';

const STATUS_TABS = [
  { key: 'reserved', label: '進行中' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
] as const;

const CoursesScreen = () => {
  const { profile } = useInitializeUser();
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>('reserved');
  const [alertVisible, setAlertVisible] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<ContractVisit | null>(null);

  const { data: contractVisits = [], isLoading } = useContractVisits({
    status: selectedStatus,
  });

  const cancelVisitMutation = useCancelContractVisit();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    const weekday = weekdays[date.getDay()];
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}(${weekday}) ${hours}:${minutes}`;
  };

  const handleCancelPress = (contractVisit: ContractVisit) => {
    setBookingToCancel(contractVisit);
    setAlertVisible(true);
  };

  const handleConfirmCancel = () => {
    if (bookingToCancel) {
      cancelVisitMutation.mutate(bookingToCancel.id, {
        onSuccess: () => {
          console.log('成功取消預約:', bookingToCancel);
          setAlertVisible(false);
          setBookingToCancel(null);
          Alert.alert('成功', '已取消預約');
        },
        onError: (error) => {
          console.error('取消預約失敗:', error);
          setAlertVisible(false);
          setBookingToCancel(null);
          Alert.alert('失敗', '取消預約失敗，請稍後再試');
        },
      });
    }
  };

  const handleCancelAlert = () => {
    setAlertVisible(false);
    setBookingToCancel(null);
  };

  const getReservedCount = () => {
    const reservedVisits = contractVisits.filter((cv) => cv.status === 'reserved');
    return reservedVisits.length;
  };

  return (
    <View style={styles.container}>
      {/* 狀態篩選器 */}
      <View style={styles.tabContainer}>
        {STATUS_TABS.map((tab) => {
          const isSelected = selectedStatus === tab.key;
          const count = tab.key === 'reserved' ? getReservedCount() : 0;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isSelected && styles.tabActive]}
              onPress={() => setSelectedStatus(tab.key)}
              activeOpacity={0.7}>
              <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                {tab.label}
                {tab.key === 'reserved' && count > 0 && `(${count})`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 課程列表 */}
      <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
        {isLoading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>載入中...</Text>
          </View>
        ) : contractVisits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暫無課程</Text>
          </View>
        ) : (
          contractVisits.map((contractVisit) => (
            <View key={contractVisit.id} style={styles.courseCard}>
              <Text style={styles.dateTime}>{formatDate(contractVisit.date)}</Text>
              <Text style={styles.courseName}>{contractVisit.visit.service_name || '未命名課程'}</Text>
              <View style={styles.courseInfo}>
                <View style={styles.providerInfo}>
                  <Text style={styles.sessionInfo}>{contractVisit.consumed_time}分鐘</Text>
                  {/* <Image
                    source={{ uri: contractVisit.visit.provider_avatar || 'https://via.placeholder.com/32' }}
                    style={styles.avatar}
                  /> */}
                  <Text style={styles.providerName}>{contractVisit.visit.provider_name || '未指定教練'}</Text>
                </View>
                {selectedStatus === 'reserved' && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancelPress(contractVisit)}
                    activeOpacity={0.7}>
                    <Text style={styles.cancelButtonText}>取消預約</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* 取消預約確認對話框 */}
      {bookingToCancel && (
        <MyAlert
          visible={alertVisible}
          title="取消預約"
          message={`確定要取消 ${bookingToCancel.visit.service_name || '此課程'} 的預約嗎？`}
          onCancel={handleCancelAlert}
          onConfirm={handleConfirmCancel}
          cancelText="否"
          confirmText="是"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '400',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateTime: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  courseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionInfo: {
    fontSize: 14,
    color: '#666666',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  providerName: {
    fontSize: 14,
    color: '#333333',
  },
  cancelButton: {
    backgroundColor: '#86909C',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
  },
});

export default CoursesScreen;
