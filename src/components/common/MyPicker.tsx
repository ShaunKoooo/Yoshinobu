import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';
import { Colors } from 'src/theme';
import { Icon } from 'src/components';

export interface PickerItem {
  label: string;
  value: string | number;
}

interface MyPickerProps {
  items: PickerItem[];
  selectedValue?: string | number;
  onValueChange: (value: string | number, index: number) => void;
  placeholder?: string;
}

const MyPicker: React.FC<MyPickerProps> = ({
  items,
  selectedValue,
  onValueChange,
  placeholder,
}) => {
  const effectiveValue = selectedValue ?? items[0]?.value;

  if (Platform.OS === 'android') {
    // Android 使用 react-native-picker-select
    return (
      <View style={styles.androidContainer}>
        <RNPickerSelect
          value={effectiveValue}
          onValueChange={(value, index) => {
            if (value !== null && value !== undefined) {
              onValueChange(value, index);
            }
          }}
          items={items}
          placeholder={placeholder ? { label: placeholder, value: null } : {}}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
          Icon={() => (
             <Icon name="down-dir" size={16} color={Colors.primary} />
          )}
        />
      </View>
    );
  }

  // iOS 使用原本的 @react-native-picker/picker
  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={effectiveValue}
          onValueChange={onValueChange}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 216,
  },
  androidContainer: {
    width: '100%',
    paddingVertical: 8,
  },
  pickerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 216,
  },
  picker: {
    width: '100%',
  },
  pickerItem: {
    fontSize: 18,
    color: '#1A1A1A',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.text.primary,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
  },
  iconContainer: {
    top: 15,
    right: 15,
  },
  placeholder: {
    color: Colors.text.secondary,
  },
});

export default MyPicker;
