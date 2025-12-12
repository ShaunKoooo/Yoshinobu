import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MyButton, CustomerForm } from 'src/components';
import { CUSTOMER_FIELDS } from 'src/components/customerForm/constants';

const AddCustomerScreen = () => {
  const [formValues, setFormValues] = useState<Record<string, string>>({
    name: '',
    phone: '',
    birthday: '',
    address: '',
    note: '',
  });

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

  const handleSubmit = () => {
    // TODO: 處理表單提交到 API
    console.log('Form data:', formValues);
  };

  return (
    <View style={styles.container}>
      <CustomerForm
        editable={true}
        fields={CUSTOMER_FIELDS}
        values={formValues}
        onFieldChange={handleFieldChange}
        onButtonPress={handleButtonPress}
      />
      <View style={styles.buttonContainer}>
        <MyButton
          isActive={false}
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
  buttonContainer: {
    padding: 16,
  },
});

export default AddCustomerScreen;
