import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  MyButton,
  CustomerForm,
  BottomSheetModal,
  MyPicker,
} from 'src/components';
import { useCreateClient } from 'src/services/hooks';
import { CUSTOMER_FIELDS } from 'src/components/customerForm/constants';
import { Calendar } from 'react-native-calendars';

const AddCustomerScreen = () => {
  const { mutate } = useCreateClient();
  const [activeModal, setActiveModal] = useState<{
    type: {};
    fieldKey: string;
  } | null>(null);
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

  const handleButtonPress = useCallback((key: string) => {
    const field = CUSTOMER_FIELDS.find((f) => f.key === key);
    if (field?.modalType) {
      setActiveModal({ type: field.modalType, fieldKey: key });
    }
  }, []);

  const handleModalClose = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleModalConfirm = useCallback(() => {
    setActiveModal(null);
  }, []);

  // 檢查必填欄位是否為空
  const validateForm = useCallback(() => {
    const requiredFields = [
      'name',
      'email',
      'mobile',
      'birthday',
      'address',
      'note',
      'gender',
    ]; // 定義必填欄位

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
  }, [formValues, mutate]);

  // Memoized modal content to avoid unnecessary re-renders
  const modalContent = useMemo(() => {
    if (!activeModal) return null;

    const field = CUSTOMER_FIELDS.find((f) => f.key === activeModal.fieldKey);

    switch (activeModal.type) {
      case 'calendar':
        return (
          <Calendar
            markedDates={{
              [formValues.birthday]: {
                selected: true,
                disableTouchEvent: true
              },
            }}
            onDayPress={(day) => {
              handleFieldChange(activeModal.fieldKey, day.dateString);
            }}
          />
        );

      case 'picker':
        return (
          <MyPicker
            items={field?.pickerItems || []}
            selectedValue={formValues[activeModal.fieldKey]}
            onValueChange={(value) => {
              handleFieldChange(activeModal.fieldKey, value as string);
            }}
          />
        );

      default:
        return null;
    }
  }, [activeModal, formValues, handleFieldChange]);

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
      {activeModal && (
        <BottomSheetModal
          visible={true}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
        >
          {modalContent}
        </BottomSheetModal>
      )}
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
