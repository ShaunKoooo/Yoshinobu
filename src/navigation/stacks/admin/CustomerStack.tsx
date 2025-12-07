import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import CustomerListScreen from 'src/screens/admin/CustomerListScreen';
import AddCustomerScreen from 'src/screens/admin/AddCustomerScreen';

export type CustomerStackParamList = {
  CustomerList: undefined;
  AddCustomer: undefined;
};

const Stack = createNativeStackNavigator<CustomerStackParamList>();

export const CustomerStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="CustomerList"
        component={CustomerListScreen}
        options={({ navigation }) => ({
          title: '客戶管理',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('AddCustomer')}
              style={styles.rightButtonContainer}>
              <Text style={styles.rightButtonText}>+ 新增客戶</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="AddCustomer"
        component={AddCustomerScreen}
        options={{
          title: '新增客戶',
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  rightButtonText: {
    color: 'white',
  },
  rightButtonContainer: {
    padding: 8,
  },
});
