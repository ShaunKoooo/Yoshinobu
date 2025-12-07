import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  MyListItem,
  MyButton,
  Icon,
} from 'src/components';
import { useNavigation } from '@react-navigation/native';

const ADD_CUSTOMER_DATA = [
  {
    title: '客戶姓名',
    placeholder: '請輸入',
    type: 'textInput' as const,
  },
  {
    title: '客戶電話',
    placeholder: '請輸入',
    type: 'textInput' as const,
  },
  {
    title: '生日',
    placeholder: '請選擇',
    type: 'button' as const,
  },
  {
    title: '聯絡地址',
    placeholder: '請輸入',
    type: 'textInput' as const,
  },
  {
    title: '特殊備註',
    placeholder: '請輸入',
    type: 'textInput' as const,
  }
];

const AddCustomerScreen = () => {
  const renderItem = ({ item }: { item: typeof ADD_CUSTOMER_DATA[0] }) => {
    if (item.type === 'textInput') {
      return (
        <View style={styles.itemContainer}>
          <View>
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <View>
            <TextInput
              style={styles.input}
              placeholder={item.placeholder}
              placeholderTextColor="#C9CDD4"
            />
          </View>
        </View>
      );
    }

    return (
      <TouchableOpacity style={styles.itemContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.button}>
          <Text style={styles.buttonText}>{item.placeholder}</Text>
          <Icon name="right-open-big" size={12} color="#4E5969" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <MyListItem
        data={ADD_CUSTOMER_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
      />
      <MyButton
        isActive={false}
        title="確認"
        onPress={() => { }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7'
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
  },
  buttonText: {
    fontSize: 16,
    color: '#C9CDD4',
    marginRight: 8,
  },
});

export default AddCustomerScreen;
