import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  MySearchBar,
  MyListItem,
  Icon,
} from 'src/components';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from 'src/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

// Mock data - 未來從 Redux 或 API 取得
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: '王小明',
    phone: '0912-345-678',
    email: 'wang@example.com',
  },
  {
    id: '2',
    name: '李小華',
    phone: '0923-456-789',
    email: 'lee@example.com',
  },
  {
    id: '3',
    name: '陳大同',
    phone: '0934-567-890',
    email: 'chen@example.com',
  },
];

const CustomerListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);

  const filteredCustomers = customers.filter(
    customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('CustomerDetail', { customerId: item.id })}
      style={styles.customerCard}>
      <View style={styles.customerInfo}>
        <View style={styles.customerDetails}>
          <Text style={styles.customerName}>{item.name}</Text>
        </View>
      </View>
      <View style={styles.addButtonContainer}>
        <Text style={styles.addButtonText}>新增預約</Text>
        <View style={{ marginRight: 4 }}>
          <Icon name="right-open-big" size={16} color="#4E5969" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <MySearchBar />
      <MyListItem
        data={filteredCustomers}
        renderItem={renderCustomerItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#F8F9FA',
  },
  // Add Button
  addButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#B49162',
    fontSize: 12,
    fontWeight: '500',
    marginRight: 40,
  },
  // List
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    padding: 16,
    height: 64,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#48484A',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  customerEmail: {
    fontSize: 14,
    color: '#999',
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default CustomerListScreen;
