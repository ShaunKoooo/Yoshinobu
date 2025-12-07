import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const AddCustomerScreen = () => {
  const navigation = useNavigation();

  const handleSave = () => {
    // 未來：保存客戶資料到 Redux 或 API
    console.log('Save customer');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>新增客戶</Text>

      {/* 未來這裡會是表單欄位 */}
      <View style={styles.formPlaceholder}>
        <Text style={styles.placeholderText}>
          表單欄位將在這裡：
          {'\n'}姓名、電話、Email 等
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="取消" onPress={() => navigation.goBack()} />
        <View style={styles.buttonSpacer} />
        <Button title="儲存" onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formPlaceholder: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  buttonSpacer: {
    width: 16,
  },
});

export default AddCustomerScreen;
