import React, {
  useState,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  MyButton,
  Icon,
  BottomSheetModal,
  MyPicker,
  MyAlert,
} from 'src/components';
import { Colors } from 'src/theme';
import {
  useServices,
  useProviders,
  useSlots,
  useCreateBooking,
  useAvailableContract,
} from 'src/services/hooks';
import { useSelectedClientIdFromClients } from 'src/hooks/useClientsWithRedux';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { useInitializeUser } from 'src/hooks/useInitializeUser';
import { useAppSelector } from 'src/store/hooks';
import { useConfirmableModal } from 'src/hooks/useConfirmableModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const formatBookingTime = (time: string) => {
  return time.replace(':00', '');
}

// Calendar 主題配置
const CALENDAR_THEME = {
  backgroundColor: 'white',
  calendarBackground: 'white',
  textSectionTitleColor: '#b6c1cd',
  selectedDayBackgroundColor: Colors.primary,
  selectedDayTextColor: '#E6DBCB',
  todayTextColor: Colors.primary,
  arrowColor: Colors.primary,
};

// 合約資訊行組件
const ContractInfoRow: React.FC<{ label: string; value: string; isHighlight?: boolean }> = ({ label, value, isHighlight }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
    <Text style={{ fontSize: 14, color: Colors.text.secondary }}>{label}</Text>
    <Text style={{ fontSize: 16, fontWeight: '500', color: isHighlight ? Colors.primary : Colors.text.primary }}>
      {value}
    </Text>
  </View>
);

const CreateBookingScreen = () => {
  const navigation = useNavigation<any>();
  const { profile } = useInitializeUser();
  const { userRole } = useAppSelector((state) => state.auth);
  const clientId = useSelectedClientIdFromClients();

  const [serviceId, setServiceId] = useState<number | null>(null);
  const [providerId, setProviderId] = useState<number | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  // 年份/月份選擇
  const currentDate = new Date();
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth() + 1);
  const [calendarKey, setCalendarKey] = useState(0);

  // 使用 useConfirmableModal 管理各個 modal
  const serviceModal = useConfirmableModal(serviceId, setServiceId);
  const therapistModal = useConfirmableModal(providerId, setProviderId);
  const timeModal = useConfirmableModal(
    { date: bookingDate, time: bookingTime },
    (values) => {
      setBookingDate(values.date);
      setBookingTime(values.time);
    }
  );
  const [yearMonthModalOpen, setYearMonthModalOpen] = useState(false);
  const [noContractAlertVisible, setNoContractAlertVisible] = useState(false);

  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: providers, isLoading: providersLoading } = useProviders();
  const createBooking = useCreateBooking();

  const selectedService = services?.services?.find(s => s.id === serviceId);

  const { data: availableContract, isLoading: contractLoading, error: contractError } = useAvailableContract(
    {
      service_id: serviceId || 0,
      consumed_time: selectedService?.duration || 0,
      client_id: clientId || undefined,
    },
    !!serviceId && !!selectedService?.duration && !!clientId
  );

  // 檢查是否有 422 錯誤（沒有可用合約）
  useEffect(() => {
    if (contractError) {
      const error = contractError as any;
      if (error?.status === 422) {
        setNoContractAlertVisible(true);
      }
    }
  }, [contractError]);

  // 當 services 載入後，自動設定第一個為預設值
  useEffect(() => {
    if (services?.services && services?.services?.length > 0 && serviceId === null) {
      setServiceId(services?.services[0].id);
    }
  }, [services, serviceId]);

  // 當 providers 載入後，自動設定第一個為預設值
  useEffect(() => {
    if (providers?.providers && providers?.providers?.length > 0 && providerId === null) {
      setProviderId(providers?.providers?.[0].id);
    }
  }, [providers, providerId]);

  // 根據選擇的日期、provider、service 動態查詢可用時段
  const activeDateForSlots = timeModal.isOpen ? timeModal.tempValue.date : bookingDate;

  const { data: slots, isLoading: slotsLoading } = useSlots(
    {
      date: activeDateForSlots,
      provider_id: providerId || 0,
      service_id: serviceId || 0,
    },
    !!activeDateForSlots && !!providerId && !!serviceId
  )

  const getFinalClientId = (): number | null => {
    if (userRole === 'coach') {
      return clientId || null;
    }
    return profile?.id || null;
  };

  const handleSubmit = () => {
    if (!serviceId || !providerId || !bookingDate || !bookingTime) {
      Alert.alert('錯誤', '請填寫所有必填欄位');
      return;
    }

    if (!availableContract) {
      Alert.alert('錯誤', '沒有可用的合約，請確認客戶是否有足夠時間的合約');
      return;
    }

    const finalClientId = getFinalClientId();
    if (!finalClientId) {
      Alert.alert('錯誤', userRole === 'coach' ? '無法取得客戶資訊，請先選擇客戶' : '無法取得您的帳戶資訊');
      return;
    }

    createBooking.mutate(
      {
        service_id: serviceId,
        provider_id: providerId,
        start_datetime: bookingDate + ' ' + formatBookingTime(bookingTime),
        client_id: finalClientId,
        contract_id: availableContract.id,
      },
      {
        onSuccess: (data) => {
          Alert.alert(
            '預約成功',
            '您的預約已建立成功！',
            [
              {
                text: '確定',
                onPress: () => {
                  if (userRole === 'client') {
                    navigation.navigate('ClientTabs', { screen: 'Courses', params: { bookingDate } });
                  } else {
                    navigation.navigate('CoachTabs', { screen: 'CourseManagement', params: { bookingDate } });
                  }
                  console.log('預約成功:', data);
                },
              },
            ]
          );
        },
        onError: (error: any) => {
          Alert.alert(
            '預約失敗',
            error?.message || '建立預約時發生錯誤，請稍後再試'
          );
        },
      }
    );
  };

  const serviceItems = services?.services?.map(service => ({
    label: service.name,
    value: service.id,
  })) || [];

  const providerItems = providers?.providers?.map(provider => ({
    label: provider.name,
    value: provider.id,
  })) || [];

  const yearItems = Array.from({ length: 21 }, (_, i) => {
    const year = currentDate.getFullYear() - 5 + i;
    return { label: `${year}年`, value: year };
  });

  const monthItems = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return { label: `${month}月`, value: month };
  });

  const handleYearMonthConfirm = () => {
    // 清空已選擇的日期和時間
    setBookingDate('');
    setBookingTime('');
    // 清空 timeModal 的 tempValue
    timeModal.setTempValue({ date: '', time: '' });
    // 更新日曆
    setCalendarKey(prev => prev + 1);
    setYearMonthModalOpen(false);
    setTimeout(() => timeModal.handleOpen(), 100);
  };

  const selectedProvider = providers?.providers?.find(p => p.id === providerId);

  const isFormValid = !!(serviceId && providerId && bookingTime && bookingDate && availableContract);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* 服務項目 */}
        <TouchableOpacity
          style={styles.row}
          onPress={serviceModal.handleOpen}
        >
          <Text style={styles.label}>服務項目</Text>
          <View style={styles.selectorContainer}>
            <Text
              style={[
                styles.selectorText,
                !selectedService && styles.placeholderText,
              ]}
            >
              {selectedService?.name || '請選擇'}
            </Text>
            <Icon name="right-open-big" size={16} />
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* 選擇芳療師或按摩師 */}
        <TouchableOpacity
          style={styles.row}
          onPress={therapistModal.handleOpen}
        >
          <Text style={styles.label}>選擇芳療師或按摩師</Text>
          <View style={styles.selectorContainer}>
            <Text
              style={[
                styles.selectorText,
                !selectedProvider && styles.placeholderText,
              ]}
            >
              {selectedProvider?.name || '請選擇'}
            </Text>
            <Icon name="right-open-big" size={16} />
          </View>
        </TouchableOpacity>

        {/* 預約時間 */}
        <TouchableOpacity
          style={styles.row}
          onPress={timeModal.handleOpen}
          disabled={!serviceId && !providerId}
        >
          <Text style={[styles.label, !serviceId && !providerId && { color: 'gray' }]}>預約時間</Text>
          <View style={styles.selectorContainer}>
            <Text
              style={[
                styles.selectorText,
                !bookingTime && styles.placeholderText,
              ]}
            >
              {bookingDate + ' ' + formatBookingTime(bookingTime) || '請選擇'}
            </Text>
            <Icon name="right-open-big" size={16} />
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* 合約號碼 */}
        <View style={styles.row}>
          <Text style={styles.label}>合約號碼</Text>
          <View style={styles.selectorContainer}>
            <Text
              style={[
                styles.selectorText,
                !availableContract && styles.placeholderText,
              ]}
            >
              {availableContract ? `${availableContract.contract_number}` : '請選擇服務後查看'}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>合約類別</Text>
          <View style={styles.selectorContainer}>
            <Text
              style={[
                styles.selectorText,
                !selectedProvider && styles.placeholderText,
              ]}
            >
              {availableContract ? `${availableContract?.category?.name}` : '請選擇服務後查看'}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>合約時間</Text>
          <View style={styles.selectorContainer}>
            <Text
              style={[
                styles.selectorText,
                !selectedProvider && styles.placeholderText,
              ]}
            >
              {availableContract ? `${availableContract?.contract_time} 分鐘` : '請選擇服務後查看'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 底部確認按鈕 */}
      <View style={styles.buttonContainer}>
        <MyButton
          isActive={!!isFormValid && !createBooking.isPending}
          title={createBooking.isPending ? "預約中..." : "確認"}
          onPress={handleSubmit}
        />
      </View>

      {/* Service Modal */}
      <BottomSheetModal
        visible={serviceModal.isOpen}
        onClose={serviceModal.handleCancel}
        onConfirm={serviceModal.handleConfirm}
      >
        <MyPicker
          items={serviceItems}
          selectedValue={serviceModal.tempValue ?? undefined}
          onValueChange={(value) => serviceModal.setTempValue(Number(value))}
        />
      </BottomSheetModal>

      {/* Therapist Modal */}
      <BottomSheetModal
        visible={therapistModal.isOpen}
        onClose={therapistModal.handleCancel}
        onConfirm={therapistModal.handleConfirm}
      >
        <MyPicker
          items={providerItems}
          selectedValue={therapistModal.tempValue ?? undefined}
          onValueChange={(value) => therapistModal.setTempValue(Number(value))}
        />
      </BottomSheetModal>

      {/* Time Modal */}
      <BottomSheetModal
        visible={timeModal.isOpen}
        onClose={timeModal.handleCancel}
        onConfirm={timeModal.handleConfirm}
      >
        <View>
          <TouchableOpacity
            style={styles.yearMonthSelector}
            onPress={() => {
              timeModal.handleCancel();
              setTimeout(() => setYearMonthModalOpen(true), 100);
            }}
          >
            <Text style={styles.yearMonthText}>
              {currentYear}年 {currentMonth}月
            </Text>
            <Icon name="down-dir" size={16} color={Colors.primary} />
          </TouchableOpacity>
          <Calendar
            key={calendarKey}
            current={`${currentYear}-${String(currentMonth).padStart(2, '0')}-01`}
            markedDates={{
              [timeModal.tempValue.date]: {
                selected: true,
                disableTouchEvent: true,
              },
            }}
            onDayPress={(day: any) => {
              timeModal.setTempValue({ ...timeModal.tempValue, date: day.dateString });
            }}
            onMonthChange={(month: any) => {
              setCurrentYear(month.year);
              setCurrentMonth(month.month);
            }}
            hideArrows={true}
            renderHeader={() => null}
            theme={CALENDAR_THEME}
          />
          <View style={styles.slotsContainer}>
            {slotsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>載入時間段中...</Text>
              </View>
            ) : slots?.slots && slots.slots.length > 0 ? (
              slots.slots.map((item, index) => {
                const itemWidth = (SCREEN_WIDTH - 32 - 30) / 4;
                const isSelected = timeModal.tempValue.time === item.time;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => timeModal.setTempValue({ ...timeModal.tempValue, time: item.time })}
                    style={[
                      styles.slotButton,
                      { width: itemWidth },
                      isSelected && styles.slotButtonSelected,
                      (index + 1) % 4 === 0 && styles.slotButtonLast,
                    ]}
                  >
                    <Text style={[
                      styles.slotText,
                      isSelected && styles.slotTextSelected,
                    ]}>
                      {formatBookingTime(item.time)}
                    </Text>
                  </TouchableOpacity>
                )
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>請選擇日期以查看可用時間段</Text>
              </View>
            )}
          </View>
        </View>
      </BottomSheetModal>

      {/* Year/Month Modal */}
      <BottomSheetModal
        visible={yearMonthModalOpen}
        onClose={() => setYearMonthModalOpen(false)}
        onConfirm={handleYearMonthConfirm}
      >
        <View>
          <View style={styles.pickerRow}>
            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>年份</Text>
              <MyPicker
                items={yearItems}
                selectedValue={currentYear}
                onValueChange={(value) => setCurrentYear(Number(value))}
              />
            </View>
            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>月份</Text>
              <MyPicker
                items={monthItems}
                selectedValue={currentMonth}
                onValueChange={(value) => setCurrentMonth(Number(value))}
              />
            </View>
          </View>
        </View>
      </BottomSheetModal>

      {/* 沒有可用合約提示 */}
      <MyAlert
        visible={noContractAlertVisible}
        title="新增預約"
        message="請先新增合約後再新增預約"
        confirmText="確定"
        onConfirm={() => setNoContractAlertVisible(false)}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    height: 64,
    borderBottomColor: '#F2F2F7',
  },
  label: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '400',
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectorText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  placeholderText: {
    color: Colors.text.placeholder,
  },
  buttonContainer: {
    padding: 16,
  },
  divider: {
    height: 8,
    backgroundColor: '#F8F9FA',
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  slotButton: {
    paddingHorizontal: 11,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    backgroundColor: '#E9E9E9',
    marginRight: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  slotButtonSelected: {
    backgroundColor: Colors.primary,
  },
  slotButtonLast: {
    marginRight: 0,
  },
  slotText: {
    fontSize: 17,
    fontWeight: '400',
    color: Colors.text.primary,
  },
  slotTextSelected: {
    color: '#FFFFFF',
  },
  yearMonthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    gap: 8,
  },
  yearMonthText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  pickerRow: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
  },
  pickerWrapper: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    width: '100%',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    width: '100%',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  contractTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  contractInfoCard: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
  },
  contractModalContent: {
    padding: 16,
  },
  contractLoadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  contractLoadingText: {
    marginTop: 12,
    color: Colors.text.secondary,
  },
  contractEmptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  contractEmptyTitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  contractEmptySubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default CreateBookingScreen;
