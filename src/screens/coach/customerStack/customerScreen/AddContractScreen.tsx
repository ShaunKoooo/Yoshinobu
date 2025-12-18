import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { MyButton, Icon } from 'src/components';
import { Colors } from 'src/theme';

const AddContractScreen = () => {
  const [isSharedContract, setIsSharedContract] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [contractNumber, setContractNumber] = useState('');
  const [contractCategory, setContractCategory] = useState('');
  const [contractType, setContractType] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = () => {
    // TODO: 處理表單提交到 API
    console.log('Contract data:', {
      isSharedContract,
      phone,
      name,
      contractNumber,
      contractType,
      time,
    });
  };

  const isFormValid = phone && name && contractNumber && contractType && time;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* 共用合約 Toggle */}
        <View style={styles.row}>
          <Text style={styles.label}>共用合約</Text>
          <Switch
            value={isSharedContract}
            onValueChange={setIsSharedContract}
          />
        </View>

        {/* 電話 */}
        {isSharedContract &&
          <View>
            <View style={styles.row}>
              <Text style={styles.label}>電話</Text>
              <TextInput
                style={styles.input}
                placeholder="請輸入"
                placeholderTextColor={Colors.text.placeholder}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>姓名</Text>
              <TextInput
                style={styles.input}
                placeholder="請輸入"
                placeholderTextColor={Colors.text.placeholder}
                value={name}
                onChangeText={setName}
                keyboardType="default"
              />
            </View>
            <View style={styles.divider} />
          </View>
        }

        {/* 合約號碼 */}
        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>合約號碼</Text>
          <View style={styles.selectorContainer}>
            <Text
              style={[
                styles.selectorText,
                !contractNumber && styles.placeholderText,
              ]}
            >
              {contractNumber || '請選擇'}
            </Text>
            <Icon name="right-open-big" size={16} />
          </View>
        </TouchableOpacity>

        {/* 合約類別 */}
        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>合約類別</Text>
          <View style={styles.selectorContainer}>
            <Text
              style={[
                styles.selectorText,
                !contractCategory && styles.placeholderText,
              ]}
            >
              {contractCategory || '請選擇'}
            </Text>
            <Icon name="right-open-big" size={16} />
          </View>
        </TouchableOpacity>

        {/* 時間 */}
        <TouchableOpacity style={styles.row}>
          <Text style={styles.label}>時間</Text>
          <View style={styles.selectorContainer}>
            <Text
              style={[
                styles.selectorText,
                !time && styles.placeholderText,
              ]}
            >
              {time || '請選擇'}
            </Text>
            <Icon name="right-open-big" size={16} />
          </View>
        </TouchableOpacity>

        {!isSharedContract && <View style={styles.column}>
          <Text style={styles.label}>上傳照片</Text>
          <TouchableOpacity
            style={{ backgroundColor: '#E0E0E0', width: 64, height: 64, justifyContent: 'center', alignItems: 'center', marginTop: 16 }}
          >
            <Text style={{ fontSize: 24, color: '#86909C' }}>+</Text>
          </TouchableOpacity>
        </View>}
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
  column: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: 136,
    borderBottomColor: '#F2F2F7',
  },
  label: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '400',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'right',
    marginLeft: 16,
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
  }
});

export default AddContractScreen;
