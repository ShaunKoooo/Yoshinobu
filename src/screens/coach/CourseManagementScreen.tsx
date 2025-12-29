import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useInitializeUser } from 'src/hooks/useInitializeUser';
import {
  useContractVisits,
  useProviders,
  useCancelContractVisit,
  useSubmitContractVisitForVerification,
} from 'src/services/hooks';
import {
  Icon,
  MyListItem,
  Badge,
  MyAlert,
  DateRangePicker,
  BottomSheetModal,
  MyPicker,
} from 'src/components';
import {
  getWeekday,
  formatDate,
  formatTime,
} from 'src/utils';
import { Colors } from 'src/theme';
import type { BadgeVariant } from 'src/components/common/Badge';
import { useConfirmableModal } from 'src/hooks/useConfirmableModal';

// 預約狀態類型
type BookingStatus = 'reserved' | 'pending_verification' | 'completed' | 'cancelled';

// Import ContractVisit type from the API types
import type { ContractVisit } from 'src/services/api/types';

// 狀態標籤配置
const STATUS_TABS = [
  { key: 'reserved', label: '已預約' },
  { key: 'pending_verification', label: '會員待核銷' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
] as const;

const CourseManagementScreen = () => {
  const navigation = useNavigation<any>();
  const { profile } = useInitializeUser();
  const { data: providers, isLoading: providersLoading } = useProviders();
  const cancelVisitMutation = useCancelContractVisit();
  const submitVerificationMutation = useSubmitContractVisitForVerification();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>('reserved');
  const [showAllStatuses, setShowAllStatuses] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<ContractVisit | null>(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [providerId, setProviderId] = useState<number | null>(null);

  // 使用 useConfirmableModal 管理 provider 選擇
  const providerModal = useConfirmableModal(providerId, setProviderId);

  const { data: contractVisits = [], isLoading, error } = useContractVisits({
    from_date: formatDate(startDate),
    to_date: formatDate(endDate),
    status: selectedStatus,
    provider_id: providerId || providers?.providers[0]?.id,
  });

  const providerItems = providers?.providers?.map((provider: { name: string; id: number }) => ({
    label: provider.name,
    value: provider.id,
  })) || [];

  // 根據 ID 找出對應的 name 來顯示
  const selectedProvider = providers?.providers?.find((p: { id: number; name: string }) => p.id === providerId);

  const formatDateRange = () => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} – ${end}`;
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

  const handleCancelPress = (contractVisit: ContractVisit) => {
    setBookingToCancel(contractVisit);
    setAlertVisible(true);
  };

  const handleConfirmCancel = () => {
    console.log(bookingToCancel?.id)
    if (bookingToCancel) {
      cancelVisitMutation.mutate(bookingToCancel.id, {
        onSuccess: () => {
          console.log('成功取消預約:', bookingToCancel);
          setAlertVisible(false);
          setBookingToCancel(null);
        },
        onError: (error) => {
          console.error('取消預約失敗:', error);
          setAlertVisible(false);
          setBookingToCancel(null);
        },
      });
    }
  };

  const handleCancelAlert = () => {
    setAlertVisible(false);
    setBookingToCancel(null);
  };

  const handleVerifyPress = (booking: any) => {
    submitVerificationMutation.mutate(booking.id, {
      onSuccess: () => {
        console.log('成功提交核銷:', booking);
      },
      onError: (error) => {
        console.error('提交核銷失敗:', error);
      },
    });
  };

  const handleDateRangeConfirm = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <View style={styles.container}>
      {/* 日期範圍選擇器 */}
      <View style={styles.dateRangeContainer}>
        <TouchableOpacity
          style={styles.dateRangeButton}
          onPress={() => setDatePickerVisible(true)}
        >
          <Icon name="clock" size={18} color={Colors.text.primary} />
          <Text style={styles.dateRangeText}>{formatDateRange()}</Text>
        </TouchableOpacity>

        {/* Provider 下拉選單 */}
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={providerModal.handleOpen}
        >
          <Icon name="down-dir" size={16} color={Colors.text.primary} />
          <Text style={styles.dropdownText}>
            {selectedProvider?.name || '全部'}
          </Text>
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
              {contractVisits?.filter((booking) => booking?.status === tab.key)?.length > 0 && `(${contractVisits?.filter((booking) => booking?.status === tab.key)?.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 預約列表 */}
      <View style={styles.listContainer}>
        <MyListItem
          data={contractVisits
            ?.filter((booking) => booking.status === selectedStatus)
            .sort((a, b) => {
              const timeA = a.visit.time;
              const timeB = b.visit.time;

              // 處理 null 值：沒有時間的排在最後
              if (!timeA && !timeB) return 0;
              if (!timeA) return 1;
              if (!timeB) return -1;

              // ISO 8601 格式直接比較
              return timeA.localeCompare(timeB);
            })}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item: contractVisit }) => {
            const visit = contractVisit.visit;
            const clientName = visit.data?.real_name || visit.data?.name || '未命名';

            return (
              <View style={styles.bookingCard}>
                {/* 日期時間和狀態 */}
                <View style={styles.cardHeader}>
                  <Text style={styles.dateTimeText}>
                    {contractVisit.date.replace(/-/g, '-')}
                    ({getWeekday(contractVisit.date)})
                    {visit.time && ` ${formatTime(visit.time)}`}
                  </Text>
                  <Badge
                    variant={getStatusBadge(contractVisit.status).variant}
                    text={getStatusBadge(contractVisit.status).text}
                  />
                </View>

                {/* 客戶姓名 */}
                <TouchableOpacity
                  onPress={() => {
                    console.log(contractVisit);
                    navigation.navigate('CustomerDetail', { id: visit.client_id });
                  }}
                >
                  <Text style={styles.customerName}>{clientName}</Text>
                </TouchableOpacity>

                {/* 服務項目 */}
                <Text style={styles.serviceText}>{visit.service_name || '未指定服務'}</Text>

                {/* 時長和教練 */}
                <View style={styles.providerRow}>
                  <Text style={styles.durationText}>{contractVisit.consumed_time} 分鐘</Text>
                  <View style={styles.providerInfo}>
                    <Image
                      source={{ uri: '' }}
                      style={styles.providerAvatar}
                    />
                    <Text style={styles.providerName}>{visit.provider_name || '未指定教練'}</Text>
                  </View>
                </View>

                {/* 操作按鈕 */}
                {contractVisit.status === 'reserved' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => handleCancelPress(contractVisit as any)}
                    >
                      <Text style={styles.cancelButtonText}>取消預約</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.verifyButton}
                      onPress={() => handleVerifyPress(contractVisit)}
                    >
                      <Text style={styles.verifyButtonText}>員工核銷</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
        />
      </View>

      {/* 取消預約確認對話框 */}
      {bookingToCancel && (
        <MyAlert
          visible={alertVisible}
          title="取消預約"
          message={`取消 ${bookingToCancel.visit.data?.real_name || '未命名'} ${bookingToCancel.date}(${getWeekday(bookingToCancel.date)}) ${bookingToCancel.visit.time || ''} ${bookingToCancel.visit.service_name || '未指定服務'} ${bookingToCancel.consumed_time}分鐘?`}
          onCancel={handleCancelAlert}
          onConfirm={handleConfirmCancel}
          cancelText="否"
          confirmText="是"
        />
      )}

      {/* 日期範圍選擇器 Modal */}
      <DateRangePicker
        visible={datePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        onConfirm={handleDateRangeConfirm}
        initialStartDate={startDate}
        initialEndDate={endDate}
      />

      {/* Provider 選擇器 Modal */}
      <BottomSheetModal
        visible={providerModal.isOpen}
        onClose={providerModal.handleCancel}
        onConfirm={providerModal.handleConfirm}
      >
        <MyPicker
          items={providerItems}
          selectedValue={providerModal.tempValue ?? undefined}
          onValueChange={(value) => providerModal.setTempValue(Number(value))}
        />
      </BottomSheetModal>
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
