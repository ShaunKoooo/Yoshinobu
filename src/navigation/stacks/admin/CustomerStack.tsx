import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { Icon } from 'src/components';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import {
  CustomerListScreen,
  AddCustomerScreen,
  CustomerDetailScreen,
} from 'src/screens/admin';

export type CustomerStackParamList = {
  CustomerList: undefined;
  AddCustomer: undefined;
  CustomerDetail: undefined;
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
        headerBackTitle: ' ',
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
        options={({ navigation }) => ({
          title: '新增客戶',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <Icon name="left-open-big" size={20} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="CustomerDetail"
        component={CustomerDetailScreen}
        options={({ navigation }) => ({
          title: '客戶名稱（TODO）',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <Icon name="left-open-big" size={20} color="white" />
            </TouchableOpacity>
          ),
        })}
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
  backButton: {
    paddingLeft: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
  },
});
