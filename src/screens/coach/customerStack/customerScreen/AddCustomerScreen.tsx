import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  MyButton,
  CustomerForm,
} from 'src/components';
import { useCreateClient } from 'src/services/hooks';
import { CUSTOMER_FIELDS } from 'src/components/customerForm/constants';
import { useCustomerFormModal } from 'src/components/customerForm/useCustomerFormModal';
import { useNavigation } from '@react-navigation/native';

const AddCustomerScreen = () => {
  const navigation = useNavigation<any>();
  const { mutate } = useCreateClient();
  const [formValues, setFormValues] = useState<Record<string, string>>({
    name: '',
    email: '',
    mobile: '',
    birthday: '',
    address: '',
    note: '',
    gender: 'male',
  });

  const handleFieldChange = useCallback((key: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const { handleButtonPress, ModalComponent } = useCustomerFormModal({
    formValues,
    onFieldChange: handleFieldChange,
  });

  // 檢查必填欄位是否為空
  const validateForm = useCallback(() => {
    const requiredFields = ['name', 'mobile', 'email', 'gender']; // 只有姓名和電話 email 性別為必填

    for (const field of requiredFields) {
      if (!formValues[field] || formValues[field].trim() === '') {
        return false;
      }
    }
    return true;
  }, [formValues]);

  const handleSubmit = useCallback(() => {
    mutate({
      name: formValues.name,
      mobile: formValues.mobile,
      email: formValues.email,
      birthday: formValues.birthday,
      address: formValues.address,
      note: formValues.note,
      gender: formValues.gender as 'male' | 'female',
    });
    navigation.goBack();
  }, [formValues, mutate]);

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
          isActive={validateForm()}
          title="確認"
          onPress={handleSubmit}
        />
      </View>
      {ModalComponent}
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
  pickerContainer: {
    height: 240,
    position: 'relative',
    justifyContent: 'center',
  },
  selectionIndicator: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 56,
    marginTop: -28,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  pickerContentContainer: {
    paddingVertical: 92, // (240 - 56) / 2 讓第一個和最後一個項目可以滾動到中間
  },
  pickerItem: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemText: {
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '400',
  },
});

export default AddCustomerScreen;
