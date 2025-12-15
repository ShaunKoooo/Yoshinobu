import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MyListItem, Icon } from 'src/components';
import { CustomerFormProps, CustomerFormField } from './types';

const CustomerForm: React.FC<CustomerFormProps> = ({
  editable,
  fields,
  values,
  onFieldChange,
  onButtonPress,
}) => {
  const renderItem = ({ item }: { item: CustomerFormField }) => {
    const value = values[item.key] || '';

    if (item.type === 'textInput') {
      return (
        <View style={styles.itemContainer}>
          <View>
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <View style={styles.rightContent}>
            {editable ? (
              <TextInput
                style={styles.input}
                placeholder={item.placeholder}
                placeholderTextColor="#C9CDD4"
                value={value}
                onChangeText={(text) => onFieldChange?.(item.key, text)}
              />
            ) : (
              <Text style={[styles.input, !value && styles.placeholder]}>
                {value || (editable ? item.placeholder : item.nonEditPlaceholder)}
              </Text>
            )}
          </View>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => editable && onButtonPress?.(item.key)}
        disabled={!editable}
      >
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.button}>
          <Text
            style={[
              styles.buttonText,
              !value && styles.placeholder,
              !editable && styles.disabledText,
            ]}
          >
            {value || (editable ? item.placeholder : item.nonEditPlaceholder)}
          </Text>
          {editable && <Icon name="right-open-big" size={12} color="#4E5969" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <MyListItem
      data={fields}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  rightContent: {
    flex: 1,
    alignItems: 'flex-end',
  },
  input: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  placeholder: {
    color: '#C9CDD4',
  },
  disabledText: {
    color: '#8F9BB3',
  },
});

export default CustomerForm;
