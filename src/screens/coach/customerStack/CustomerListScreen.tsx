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
import { Colors } from 'src/theme';
import { useClientsWithRedux } from 'src/hooks/useClientsWithRedux';
import { useDispatch } from 'react-redux';
import { setSelectedClient } from 'src/store/slices/clientsSlice';
import type { Client } from 'src/services/api/types';


const CustomerListScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  // 使用 useClientsWithRedux 會自動將資料同步到 Redux
  const { data: clients = [], isLoading, error } = useClientsWithRedux();

  // 根據 searchQuery 過濾客戶
  const filteredClients = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return clients;
    }

    return clients.filter((item: Client) => {
      const name = item?.client?.name?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();
      return name.includes(query);
    });
  }, [clients, searchQuery]);

  const handleClientPress = (item: Client) => {
    // 將選中的客戶存到 Redux
    dispatch(setSelectedClient(item));
    // 導航到客戶詳細頁面
    navigation.navigate('CustomerDetail', { id: item?.client?.id });
  };

  const handleCreateBookingPress = (item: Client) => {
    // 將選中的客戶存到 Redux
    dispatch(setSelectedClient(item));
    // 導航到新增預約頁面
    navigation.navigate('CreateBooking');
  };

  const renderCustomerItem = ({ item }: { item: Client }) => {
    const { name, id } = item?.client || {};
    return (
      <TouchableOpacity
        onPress={() => handleClientPress(item)}
        style={styles.customerCard}
      >
        <View style={styles.customerInfo}>
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>{name}</Text>
          </View>
        </View>
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleCreateBookingPress(item);
            }}
          >
            <Text style={styles.addButtonText}>新增預約</Text>
          </TouchableOpacity>
          <View style={{ marginRight: 4 }}>
            <Icon name="right-open-big" size={16} color="#4E5969" />
          </View>
        </View>
      </TouchableOpacity>
    )
  };

  return (
    <View style={styles.container}>
      <MySearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="搜尋客戶姓名"
      />
      <MyListItem
        data={filteredClients}
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
    color: Colors.primary,
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
