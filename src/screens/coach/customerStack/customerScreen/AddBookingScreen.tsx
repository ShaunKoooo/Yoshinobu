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
  Badge,
  BottomSheetModal,
  MyPicker,
} from 'src/components';
import { Colors } from 'src/theme';
import {
  useServices,
  useProviders,
  useSlots,
  useCreateBooking,
} from 'src/services/hooks';
import { useSelectedClientIdFromClients } from 'src/hooks/useClientsWithRedux';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const formatBookingTime = (time: string) => {
  return time.replace(':00', '');
}

const AddBookingScreen = () => {
  const navigation = useNavigation<any>();
  const clientId = useSelectedClientIdFromClients(); // 從 Redux 取得當前選中的 client_id
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<'service' | 'therapist' | 'time' | 'yearMonth' | null>(null);
  const [providerId, setProviderId] = useState<number | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [contractNumber, setContractNumber] = useState('C123456789');
  const [contractType, setContractType] = useState('專業徒手');
  const [duration, setDuration] = useState('180分鐘');
  const [isSharedContract, setIsSharedContract] = useState(true);

  // 年份/月份選擇
  const currentDate = new Date();
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth() + 1);
  const [calendarKey, setCalendarKey] = useState(0);

  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: providers, isLoading: providersLoading } = useProviders();
  const createBooking = useCreateBooking();

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
  const { data: slots, isLoading: slotsLoading } = useSlots(
    {
      date: bookingDate,
      provider_id: providerId || 0,
      service_id: serviceId || 0,
    },
    !!bookingDate && !!providerId && !!serviceId // 只有全部都選了才執行
  )

  const handleSubmit = () => {
    if (!serviceId || !providerId || !bookingDate || !bookingTime) {
      Alert.alert('錯誤', '請填寫所有必填欄位');
      return;
    }

    // 驗證是否有 client_id
    if (!clientId) {
      Alert.alert('錯誤', '無法取得客戶資訊，請先選擇客戶');
      return;
    }

    createBooking.mutate(
      {
        service_id: serviceId,
        provider_id: providerId,
        start_datetime: bookingDate + ' ' + formatBookingTime(bookingTime), // YYYY-MM-DD 格式
        client_id: clientId,
        contract_id: 1005,
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
                  navigation.navigate('AdminTabs', { screen: 'CourseManagement' })
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
    // 更新 Calendar 顯示的月份
    setCalendarKey(prev => prev + 1);
    setActiveModal('time');
  };

  const modalContent = () => {
    switch (activeModal) {
      case 'service':
        return (
          <MyPicker
            items={serviceItems}
            selectedValue={serviceId ?? undefined}
            onValueChange={(value) => { setServiceId(Number(value)); }}
          />
        );
      case 'therapist':
        return (
          <MyPicker
            items={providerItems}
            selectedValue={providerId ?? undefined}
            onValueChange={(value) => { setProviderId(Number(value)); }}
          />
        );
      case 'yearMonth':
        return (
          <View>
            <View style={styles.pickerRow}>
              <View style={styles.pickerWrapper}>
                <Text style={styles.pickerLabel}>年份</Text>
                <MyPicker
                  items={yearItems}
                  selectedValue={currentYear}
                  onValueChange={(value) => { setCurrentYear(Number(value)); }}
                />
              </View>
              <View style={styles.pickerWrapper}>
                <Text style={styles.pickerLabel}>月份</Text>
                <MyPicker
                  items={monthItems}
                  selectedValue={currentMonth}
                  onValueChange={(value) => { setCurrentMonth(Number(value)); }}
                />
              </View>
            </View>
          </View>
        );
      case 'time':
        return (
          <View>
            <TouchableOpacity
              style={styles.yearMonthSelector}
              onPress={() => setActiveModal('yearMonth')}
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
                [bookingDate]: {
                  selected: true,
                  disableTouchEvent: true,
                },
              }}
              onDayPress={(day: any) => {
                setBookingDate(day.dateString);
              }}
              onMonthChange={(month: any) => {
                setCurrentYear(month.year);
                setCurrentMonth(month.month);
              }}
              hideArrows={true}
              renderHeader={() => null}
              theme={{
                backgroundColor: 'white',
                calendarBackground: 'white',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: Colors.primary,
                selectedDayTextColor: '#E6DBCB',
                todayTextColor: Colors.primary,
                arrowColor: Colors.primary,
              }}
            />
            <View style={styles.slotsContainer}>
              {slotsLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <Text style={styles.loadingText}>載入時間段中...</Text>
                </View>
              ) : slots?.slots && slots.slots.length > 0 ? (
                slots.slots.map((item, index) => {
                  const itemWidth = (SCREEN_WIDTH - 32 - 30) / 4; // 32 = container padding, 30 = gaps (3 gaps of 10px)
                  const isSelected = bookingTime === item.time;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setBookingTime(item.time)}
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
        );
      default:
        return null;
    }
  };


  // 根據 ID 找出對應的 name 來顯示
  const selectedService = services?.services?.find(s => s.id === serviceId);
  const selectedProvider = providers?.providers?.find(p => p.id === providerId);

  const isFormValid = serviceId && providerId && bookingTime;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* 服務項目 */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => setActiveModal('service')}
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
          onPress={() => setActiveModal('therapist')}
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
          onPress={() => { setActiveModal('time'); }}
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
              {bookingTime || '請選擇'}
            </Text>
            <Icon name="right-open-big" size={16} />
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* 合約號碼 */}
        {/* <View style={styles.row}>
          <Text style={styles.label}>合約號碼</Text>
          <View style={styles.contractContainer}>
            <Text style={styles.contractNumber}>{contractNumber}</Text>
            {isSharedContract && <Badge variant="shared" text="共用" />}
          </View>
        </View> */}

        {/* 合約類別 */}
        {/* <View style={styles.row}>
          <Text style={styles.label}>合約類別</Text>
          <Text style={styles.valueText}>{contractType}</Text>
        </View> */}

        {/* 時間 */}
        {/* <View style={styles.row}>
          <Text style={styles.label}>時間</Text>
          <Text style={styles.valueText}>{duration}</Text>
        </View> */}
      </ScrollView>

      {/* 底部確認按鈕 */}
      <View style={styles.buttonContainer}>
        <MyButton
          isActive={!!isFormValid && !createBooking.isPending}
          title={createBooking.isPending ? "預約中..." : "確認"}
          onPress={handleSubmit}
        />
      </View>

      <BottomSheetModal
        visible={activeModal != null}
        onClose={() => { setActiveModal(null); }}
        onConfirm={() => {
          if (activeModal === 'yearMonth') {
            handleYearMonthConfirm();
          } else {
            setActiveModal(null);
          }
        }}
        children={modalContent()}
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
  contractContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contractNumber: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  valueText: {
    fontSize: 16,
    color: Colors.text.primary,
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
});

export default AddBookingScreen;
