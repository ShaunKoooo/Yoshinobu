import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MyButton, Icon, Badge } from 'src/components';
import { Colors } from 'src/theme';

const AddBookingScreen = () => {
  const [serviceItem, setServiceItem] = useState('');
  const [therapist, setTherapist] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [contractNumber, setContractNumber] = useState('C123456789');
  const [contractType, setContractType] = useState('專業徒手');
  const [duration, setDuration] = useState('180分鐘');
  const [isSharedContract, setIsSharedContract] = useState(true);

  const handleSubmit = () => {
    // TODO: 處理表單提交到 API
    console.log('Booking data:', {
      serviceItem,
      therapist,
      bookingTime,
      contractNumber,
      contractType,
      duration,
      isSharedContract,
    });
  };

  const isFormValid = serviceItem && therapist && bookingTime;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* 服務項目 */}
        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>服務項目</Text>
          <View style={styles.selectorContainer}>
            <Text
              style={[
                styles.selectorText,
                !serviceItem && styles.placeholderText,
              ]}
            >
              {serviceItem || '請選擇'}
            </Text>
            <Icon name="right-open-big" size={16} />
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* 選擇芳療師或按摩師 */}
        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>選擇芳療師或按摩師</Text>
          <View style={styles.selectorContainer}>
            <Text
              style={[
                styles.selectorText,
                !therapist && styles.placeholderText,
              ]}
            >
              {therapist || '請選擇'}
            </Text>
            <Icon name="right-open-big" size={16} />
          </View>
        </TouchableOpacity>

        {/* 預約時間 */}
        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>預約時間</Text>
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
        <View style={styles.row}>
          <Text style={styles.label}>合約號碼</Text>
          <View style={styles.contractContainer}>
            <Text style={styles.contractNumber}>{contractNumber}</Text>
            {isSharedContract && <Badge variant="shared" text="共用" />}
          </View>
        </View>

        {/* 合約類別 */}
        <View style={styles.row}>
          <Text style={styles.label}>合約類別</Text>
          <Text style={styles.valueText}>{contractType}</Text>
        </View>

        {/* 時間 */}
        <View style={styles.row}>
          <Text style={styles.label}>時間</Text>
          <Text style={styles.valueText}>{duration}</Text>
        </View>
      </ScrollView>

      {/* 底部確認按鈕 */}
      <View style={styles.buttonContainer}>
        <MyButton
          isActive={!!isFormValid}
          title="確認"
          onPress={handleSubmit}
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
});

export default AddBookingScreen;
