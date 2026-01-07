import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Colors } from 'src/theme';
import { useContractVisits, useCancelContractVisit, useCompleteContractVisit } from 'src/services/hooks';
import { MyAlert } from 'src/components';
import type { ContractVisit } from 'src/services/api/types';
import { useInitializeUser } from 'src/hooks/useInitializeUser';
import {
  formatDate,
  getWeekday,
  formatTime,
} from 'src/utils';

type BookingStatus = 'reserved' | 'completed' | 'cancelled' | 'pending_verification';

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
  const [completeAlertVisible, setCompleteAlertVisible] = useState(false);
  const [bookingToComplete, setBookingToComplete] = useState<ContractVisit | null>(null);

  // 為每個狀態分別查詢資料
  const reservedQuery = useContractVisits({
    status: 'reserved',
  });

  const pendingVerificationQuery = useContractVisits({
    status: 'pending_verification',
  });

  const completedQuery = useContractVisits({
    status: 'completed',
  });

  const cancelledQuery = useContractVisits({
    status: 'cancelled',
  });

  // 根據當前選中的狀態取得對應的資料和狀態
  const getCurrentData = () => {
    switch (selectedStatus) {
      case 'reserved':
        // 合併 reserved 和 pending_verification 的資料
        const reservedData = reservedQuery.data || [];
        const pendingData = pendingVerificationQuery.data || [];
        return {
          data: [...reservedData, ...pendingData],
          isLoading: reservedQuery.isLoading || pendingVerificationQuery.isLoading,
          isRefetching: reservedQuery.isRefetching || pendingVerificationQuery.isRefetching,
          refetch: () => {
            reservedQuery.refetch();
            pendingVerificationQuery.refetch();
          },
        };
      case 'completed':
        return {
          data: completedQuery.data || [],
          isLoading: completedQuery.isLoading,
          isRefetching: completedQuery.isRefetching,
          refetch: completedQuery.refetch,
        };
      case 'cancelled':
        return {
          data: cancelledQuery.data || [],
          isLoading: cancelledQuery.isLoading,
          isRefetching: cancelledQuery.isRefetching,
          refetch: cancelledQuery.refetch,
        };
      default:
        return {
          data: reservedQuery.data || [],
          isLoading: reservedQuery.isLoading,
          isRefetching: reservedQuery.isRefetching,
          refetch: reservedQuery.refetch,
        };
    }
  };

  const currentData = getCurrentData();
  const contractVisits = currentData.data;
  const isLoading = currentData.isLoading;
  const refetch = currentData.refetch;
  const isRefetching = currentData.isRefetching;

  // 取得各狀態的數量
  const getStatusCount = (status: BookingStatus) => {
    switch (status) {
      case 'reserved':
        // reserved tab 顯示 reserved + pending_verification 的總數
        return (reservedQuery.data?.length || 0) + (pendingVerificationQuery.data?.length || 0);
      case 'completed':
        return completedQuery.data?.length || 0;
      case 'cancelled':
        return cancelledQuery.data?.length || 0;
      default:
        return 0;
    }
  };

  const cancelVisitMutation = useCancelContractVisit();
  const completeVisitMutation = useCompleteContractVisit();

  // Pull to refresh handler
  const handleRefresh = () => {
    refetch();
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

  const handleCompletePress = (contractVisit: ContractVisit) => {
    setBookingToComplete(contractVisit);
    setCompleteAlertVisible(true);
  };

  const handleConfirmComplete = () => {
    if (bookingToComplete) {
      completeVisitMutation.mutate(bookingToComplete.id, {
        onSuccess: () => {
          console.log('成功核銷課程:', bookingToComplete);
          setCompleteAlertVisible(false);
          setBookingToComplete(null);
          Alert.alert('成功', '課程已核銷完成');
        },
        onError: (error) => {
          console.error('核銷課程失敗:', error);
          setCompleteAlertVisible(false);
          setBookingToComplete(null);
          Alert.alert('失敗', '核銷課程失敗，請稍後再試');
        },
      });
    }
  };

  const handleCancelCompleteAlert = () => {
    setCompleteAlertVisible(false);
    setBookingToComplete(null);
  };

  // 檢查是否在預約時間的 30 分鐘內
  const isWithin30Minutes = (contractVisit: ContractVisit): boolean => {
    const { time } = contractVisit.visit;
    if (!time) return false;

    // 組合日期和時間
    const bookingDateTime = new Date(time);
    const now = new Date();

    // 計算時間差（毫秒）
    const timeDiff = bookingDateTime.getTime() - now.getTime();

    // 30 分鐘 = 30 * 60 * 1000 毫秒
    const thirtyMinutes = 30 * 60 * 1000;

    // 如果時間差小於 30 分鐘且大於 0（還沒過期），則返回 true
    return timeDiff > 0 && timeDiff <= thirtyMinutes;
  };

  return (
    <View style={styles.container}>
      {/* 狀態篩選器 */}
      <View style={styles.tabContainer}>
        {STATUS_TABS.map((tab) => {
          const isSelected = selectedStatus === tab.key;
          const count = getStatusCount(tab.key as BookingStatus);
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isSelected && styles.tabActive]}
              onPress={() => setSelectedStatus(tab.key)}
              activeOpacity={0.7}>
              <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                {tab.label}
                {count > 0 && ` (${count})`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 課程列表 */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
          />
        }
      >
        {isLoading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>載入中...</Text>
          </View>
        ) : contractVisits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暫無課程</Text>
          </View>
        ) : (
          contractVisits.sort((a, b) => {
            const timeA = a.visit.time;
            const timeB = b.visit.time;

            // 處理 null 值：沒有時間的排在最後
            if (!timeA && !timeB) return 0;
            if (!timeA) return 1;
            if (!timeB) return -1;

            // ISO 8601 格式直接比較
            return timeA.localeCompare(timeB);
          }).map((contractVisit) => (
            <View key={contractVisit.id} style={styles.courseCard}>
              <Text style={styles.dateTime}>{
                formatDate(new Date(contractVisit.visit.date ?? '')) + ' ' +
                getWeekday(contractVisit.visit.date ?? '') + ' ' +
                formatTime(contractVisit.visit.time ?? '')
              }</Text>
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
                  <>
                    {contractVisit.status === 'reserved' ? (
                      <TouchableOpacity
                        style={[
                          styles.cancelButton,
                          isWithin30Minutes(contractVisit) && styles.disabledButton
                        ]}
                        onPress={() => !isWithin30Minutes(contractVisit) && handleCancelPress(contractVisit)}
                        activeOpacity={isWithin30Minutes(contractVisit) ? 1 : 0.7}
                        disabled={isWithin30Minutes(contractVisit)}>
                        <Text style={[
                          styles.cancelButtonText,
                          isWithin30Minutes(contractVisit) && styles.disabledButtonText
                        ]}>取消預約</Text>
                      </TouchableOpacity>
                    ) : contractVisit.status === 'pending_verification' ? (
                      <TouchableOpacity
                        style={{ backgroundColor: Colors.primary, borderRadius: 6, paddingHorizontal: 16, paddingVertical: 8 }}
                        onPress={() => handleCompletePress(contractVisit)}
                        activeOpacity={0.7}>
                        <Text style={styles.cancelButtonText}>核銷課程</Text>
                      </TouchableOpacity>
                    ) : null}
                  </>
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

      {/* 核銷課程確認對話框 */}
      {bookingToComplete && (
        <MyAlert
          visible={completeAlertVisible}
          title="核銷課程"
          message={`確定要核銷 ${bookingToComplete.visit.service_name || '此課程'} 嗎？`}
          onCancel={handleCancelCompleteAlert}
          onConfirm={handleConfirmComplete}
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
  disabledButton: {
    backgroundColor: '#D9D9D9',
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButtonText: {
    color: '#999999',
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
