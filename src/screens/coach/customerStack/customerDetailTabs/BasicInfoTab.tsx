import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomerForm } from 'src/components';
import { CUSTOMER_FIELDS } from 'src/components/customerForm/constants';
import { useBasicInfoEdit } from '../CustomerDetailScreen';

const BasicInfoTab = () => {
  const { isEditing } = useBasicInfoEdit();
  const [formValues, setFormValues] = useState<Record<string, string>>({
    name: '',
    phone: '',
    birthday: '',
    address: '',
    note: '',
  });

  // TODO: 從 API 取得資料後更新 formValues
  // useEffect(() => {
  //   fetchCustomerData().then((data) => {
  //     setFormValues({
  //       name: data.name,
  //       phone: data.phone,
  //       birthday: data.birthday,
  //       address: data.address,
  //       note: data.note,
  //     });
  //   });
  // }, []);

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

  return (
    <View style={styles.container}>
      <CustomerForm
        editable={isEditing}
        fields={CUSTOMER_FIELDS}
        values={formValues}
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
