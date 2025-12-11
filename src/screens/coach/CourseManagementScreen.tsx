import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal } from 'src/components';

const CourseManagementScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirm = (startDate: Date, endDate: Date) => {
    console.log('Selected dates:', startDate, endDate);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>課程管理</Text>
      <>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text>選擇日期</Text>
        </TouchableOpacity>

        <BottomSheetModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={handleConfirm}
        />
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default CourseManagementScreen;
