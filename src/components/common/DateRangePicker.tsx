import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DatePicker from 'react-native-date-picker';
import BottomSheetModal from './BottomSheetModal';
import { Colors } from 'src/theme';

interface DateRangePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
  initialStartDate: Date;
  initialEndDate: Date;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  visible,
  onClose,
  onConfirm,
  initialStartDate,
  initialEndDate,
}) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);

  const handleConfirm = () => {
    onConfirm(startDate, endDate);
    onClose();
  };

  const handleCancel = () => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setIsSelectingStartDate(true);
    onClose();
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [showDatePickerModal, setShowDatePickerModal] = useState(false);

  if (Platform.OS === 'android') {
    return (
      <>
        <BottomSheetModal
          visible={visible}
          onClose={handleCancel}
          onConfirm={handleConfirm}
        >
          <View style={styles.container}>
            {/* Date Selection Buttons */}
            <View style={styles.dateButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  isSelectingStartDate && styles.dateButtonActive,
                ]}
                onPress={() => {
                  setIsSelectingStartDate(true);
                  setShowDatePickerModal(true);
                }}
              >
                <Text
                  style={[
                    styles.dateButtonText,
                    isSelectingStartDate && styles.dateButtonTextActive,
                  ]}
                >
                  {formatDate(startDate)}
                </Text>
              </TouchableOpacity>
              <View style={styles.dateSeparator} />
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  !isSelectingStartDate && styles.dateButtonActive,
                ]}
                onPress={() => {
                  setIsSelectingStartDate(false);
                  setShowDatePickerModal(true);
                }}
              >
                <Text
                  style={[
                    styles.dateButtonText,
                    !isSelectingStartDate && styles.dateButtonTextActive,
                  ]}
                >
                  {formatDate(endDate)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetModal>

        <DatePicker
          modal
          open={showDatePickerModal}
          date={isSelectingStartDate ? startDate : endDate}
          onConfirm={(date) => {
            if (isSelectingStartDate) {
              setStartDate(date);
            } else {
              setEndDate(date);
            }
            setShowDatePickerModal(false);
          }}
          onCancel={() => {
            setShowDatePickerModal(false);
          }}
          mode="date"
          locale='zh-TW'
          minimumDate={isSelectingStartDate ? undefined : startDate}
          maximumDate={isSelectingStartDate ? endDate : undefined}
        />
      </>
    );
  }

  // iOS
  return (
    <BottomSheetModal
      visible={visible}
      onClose={handleCancel}
      onConfirm={handleConfirm}
    >
      <View style={styles.container}>
        {/* Date Selection Buttons */}
        <View style={styles.dateButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.dateButton,
              isSelectingStartDate && styles.dateButtonActive,
            ]}
            onPress={() => setIsSelectingStartDate(true)}
          >
            <Text
              style={[
                styles.dateButtonText,
                isSelectingStartDate && styles.dateButtonTextActive,
              ]}
            >
              {formatDate(startDate)}
            </Text>
          </TouchableOpacity>
          <View style={styles.dateSeparator} />
          <TouchableOpacity
            style={[
              styles.dateButton,
              !isSelectingStartDate && styles.dateButtonActive,
            ]}
            onPress={() => setIsSelectingStartDate(false)}
          >
            <Text
              style={[
                styles.dateButtonText,
                !isSelectingStartDate && styles.dateButtonTextActive,
              ]}
            >
              {formatDate(endDate)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        <View style={styles.pickerContainer}>
          <DatePicker
            date={isSelectingStartDate ? startDate : endDate}
            onDateChange={(date) => {
              if (isSelectingStartDate) {
                setStartDate(date);
              } else {
                setEndDate(date);
              }
            }}
            mode="date"
            locale='zh-TW'
            minimumDate={isSelectingStartDate ? undefined : startDate}
            maximumDate={isSelectingStartDate ? endDate : undefined}
            theme="light"
          />
        </View>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  dateButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateButtonLabel: {
    fontSize: 13,
    color: '#86909C',
    marginBottom: 4,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#4E5969',
    fontWeight: '500',
  },
  dateButtonTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  dateButtonActive: {
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  pickerContainer: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  pickerContainerAndroid: {
    minHeight: 300,
    justifyContent: 'center',
  },
  datePickerAndroid: {
    width: '100%',
    height: 300,
  },
  dateSeparator: {
    width: 16,
    height: 1,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    alignSelf: 'center',
  }
});

export default DateRangePicker;
