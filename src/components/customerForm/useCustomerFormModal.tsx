import { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { BottomSheetModal, MyPicker, Icon } from 'src/components';
import { Colors } from 'src/theme';
import { CUSTOMER_FIELDS } from './constants';
import { useConfirmableModal } from 'src/hooks/useConfirmableModal';

interface UseCustomerFormModalProps {
  formValues: Record<string, string>;
  onFieldChange: (key: string, value: string) => void;
}

export const useCustomerFormModal = ({
  formValues,
  onFieldChange,
}: UseCustomerFormModalProps) => {
  const [activeModal, setActiveModal] = useState<{
    type: 'calendar' | 'picker' | 'yearMonth' | null;
    fieldKey: string;
  } | null>(null);

  // 年份/月份選擇
  const currentDate = new Date();
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth() + 1);
  const [calendarKey, setCalendarKey] = useState(0);

  // 使用 useConfirmableModal 管理暫存值
  const [tempFieldKey, setTempFieldKey] = useState<string>('');
  const fieldModal = useConfirmableModal(
    formValues[tempFieldKey] || '',
    (value) => {
      if (tempFieldKey) {
        onFieldChange(tempFieldKey, value);
      }
    }
  );

  const handleButtonPress = useCallback((key: string) => {
    const field = CUSTOMER_FIELDS.find((f) => f.key === key);
    if (field?.modalType) {
      setTempFieldKey(key);
      fieldModal.setTempValue(formValues[key] || ''); // 初始化暫存值
      setActiveModal({ type: field.modalType, fieldKey: key });
      // 如果是生日欄位且沒有值，預設設為 1970 年
      if (key === 'birthday' && !formValues[key]) {
        setCurrentYear(1970);
        setCurrentMonth(1);
        setCalendarKey(prev => prev + 1);
      }
    }
  }, [formValues, fieldModal]);

  const handleModalClose = useCallback(() => {
    fieldModal.handleCancel(); // 取消時丟棄暫存值
    setActiveModal(null);
  }, [fieldModal]);

  const handleModalConfirm = useCallback(() => {
    if (activeModal?.type === 'yearMonth') {
      // 更新 Calendar 顯示的月份
      setCalendarKey(prev => prev + 1);
      setActiveModal({ type: 'calendar', fieldKey: activeModal.fieldKey });
    } else {
      // 套用暫存值
      fieldModal.handleConfirm();
      setActiveModal(null);
    }
  }, [activeModal, fieldModal]);

  // 生成年份選項（根據是否為生日欄位）
  const isBirthdayField = activeModal?.fieldKey === 'birthday';
  const yearItems = isBirthdayField
    ? Array.from({ length: 101 }, (_, i) => {
      const year = 1925 + i; // 1925 - 2025
      return { label: `${year}年`, value: year };
    })
    : Array.from({ length: 21 }, (_, i) => {
      const year = currentDate.getFullYear() - 5 + i;
      return { label: `${year}年`, value: year };
    });

  // 生成月份選項
  const monthItems = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return { label: `${month}月`, value: month };
  });

  // Memoized modal content to avoid unnecessary re-renders
  const modalContent = useMemo(() => {
    if (!activeModal) return null;

    const field = CUSTOMER_FIELDS.find((f) => f.key === activeModal.fieldKey);

    switch (activeModal.type) {
      case 'calendar':
        const isBirthday = activeModal.fieldKey === 'birthday';
        const maxDate = isBirthday ? currentDate.toISOString().split('T')[0] : undefined;
        return (
          <View>
            <TouchableOpacity
              style={styles.yearMonthSelector}
              onPress={() => setActiveModal({ type: 'yearMonth', fieldKey: activeModal.fieldKey })}
            >
              <Text style={styles.yearMonthText}>
                {currentYear}年 {currentMonth}月
              </Text>
              <Icon name="down-dir" size={16} color={Colors.primary} />
            </TouchableOpacity>
            <Calendar
              key={calendarKey}
              current={`${currentYear}-${String(currentMonth).padStart(2, '0')}-01`}
              initialDate={fieldModal.tempValue || undefined}
              maxDate={maxDate}
              markedDates={{
                [fieldModal.tempValue]: {
                  selected: true,
                  disableTouchEvent: true,
                },
              }}
              onDayPress={(day) => {
                fieldModal.setTempValue(day.dateString);
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
          </View>
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

      case 'picker':
        return (
          <MyPicker
            items={field?.pickerItems || []}
            selectedValue={fieldModal.tempValue}
            onValueChange={(value) => {
              fieldModal.setTempValue(value as string);
            }}
          />
        );

      default:
        return null;
    }
  }, [activeModal, formValues, onFieldChange, currentYear, currentMonth, calendarKey, yearItems, monthItems]);

  // Modal component to render
  const ModalComponent = activeModal ? (
    <BottomSheetModal
      visible={true}
      onClose={handleModalClose}
      onConfirm={handleModalConfirm}
    >
      {modalContent}
    </BottomSheetModal>
  ) : null;

  return {
    handleButtonPress,
    ModalComponent,
  };
};

const styles = StyleSheet.create({
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
});
