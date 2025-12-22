import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomerForm, MyAlert } from 'src/components';
import { CUSTOMER_FIELDS } from 'src/components/customerForm/constants';
import { useBasicInfoEdit } from '../CustomerDetailScreen';
import { useClient, useUpdateClient } from 'src/services/hooks';
import { useCustomerFormModal } from 'src/components/customerForm/useCustomerFormModal';
import { useNavigation } from '@react-navigation/native';

const BasicInfoTab = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const { isEditing, setSaveHandler, exitEditMode } = useBasicInfoEdit();
  const { id } = route.params || {};
  const { data, isLoading } = useClient(id);
  const { mutate: updateClient } = useUpdateClient();

  // 用於編輯模式的表單狀態
  const [formValues, setFormValues] = useState<Record<string, string>>({
    name: '',
    email: '',
    mobile: '',
    birthday: '',
    address: '',
    note: '',
    gender: '',
  });

  // Alert 狀態
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
  }>({
    visible: false,
    title: '',
    message: '',
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
        gender: data.client.gender || '',
      });
    }
  }, [data]);

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

  // 驗證表單
  const validateForm = useCallback(() => {
    const requiredFields = ['name', 'mobile', 'email', 'birthday', 'address', 'note', 'gender'];

    for (const field of requiredFields) {
      if (!formValues[field] || formValues[field].trim() === '') {
        return false;
      }
    }
    return true;
  }, [formValues]);

  // 關閉 Alert
  const closeAlert = useCallback(() => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  }, []);

  // 儲存處理
  const handleSave = useCallback(() => {
    if (!validateForm()) {
      setAlertConfig({
        visible: true,
        title: '驗證失敗',
        message: '請確保所有欄位都已填寫',
      });
      // 驗證失敗，不關閉編輯模式
      return;
    }

    updateClient(
      {
        id,
        data: {
          name: formValues.name,
          mobile: formValues.mobile,
          email: formValues.email,
          birthday: formValues.birthday,
          address: formValues.address,
          note: formValues.note,
          gender: formValues.gender as 'male' | 'female',
        },
      },
      {
        onSuccess: () => {
          setAlertConfig({
            visible: true,
            title: '成功',
            message: '客戶資料已更新',
          });
          // 只有在儲存成功時才關閉編輯模式
          exitEditMode();
          // 導航回到客戶列表頁面
          navigation.goBack();
        },
        onError: (error) => {
          setAlertConfig({
            visible: true,
            title: '錯誤',
            message: '更新失敗，請稍後再試',
          });
          // 儲存失敗，不關閉編輯模式
          console.error('Update client error:', error);
        },
      }
    );
  }, [id, formValues, validateForm, updateClient, exitEditMode]);

  // 註冊儲存處理函數
  useEffect(() => {
    setSaveHandler(handleSave);
  }, [handleSave, setSaveHandler]);

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
    gender: data.client.gender || '',
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
      {ModalComponent}
      <MyAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onCancel={closeAlert}
        onConfirm={closeAlert}
        cancelText="取消"
        confirmText="確定"
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
