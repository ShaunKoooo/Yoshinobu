import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomerForm } from 'src/components';
import { CUSTOMER_FIELDS } from 'src/components/customerForm/constants';
import { useBasicInfoEdit } from '../CustomerDetailScreen';
import { useClient } from 'src/services/hooks';

const BasicInfoTab = ({ route }: any) => {
  const { isEditing } = useBasicInfoEdit();
  const { id } = route.params || {};
  const { data, isLoading } = useClient(id);

  // 用於編輯模式的表單狀態
  const [formValues, setFormValues] = useState<Record<string, string>>({
    name: '',
    email: '',
    mobile: '',
    birthday: '',
    address: '',
    note: '',
  });

  // 當 API 資料載入完成時，更新 formValues
  useEffect(() => {
    if (data?.client) {
      setFormValues({
        name: data.client.name || '',
        email: data.client.email || '',
        mobile: data.client.mobile || '',
        birthday: data.client.birthday || '',
        address: data.client.address || '',
        note: data.client.note || '',
      });
    }
  }, [data]);

  const handleFieldChange = (key: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleButtonPress = (key: string) => {
    // TODO: 處理按鈕點擊，例如打開日期選擇器
    console.log('Button pressed:', key);
  };

  // 載入中狀態
  // TODO: 可以加入載入指示器
  if (isLoading || !data) {
    return <View style={styles.container} />;
  }

  // 將 API 資料轉換為表單格式
  const apiDataAsFormValues: Record<string, string> = {
    name: data.client.name || '',
    email: data.client.email || '',
    mobile: data.client.mobile || '',
    birthday: data.client.birthday || '',
    address: data.client.address || '',
    note: data.client.note || '',
  };

  // 根據編輯模式決定顯示的值
  const displayValues = isEditing ? formValues : apiDataAsFormValues;

  return (
    <View style={styles.container}>
      <CustomerForm
        editable={isEditing}
        fields={CUSTOMER_FIELDS}
        values={displayValues}
        onFieldChange={handleFieldChange}
        onButtonPress={handleButtonPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});

export default BasicInfoTab;
