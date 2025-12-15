import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

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
}) => {
  const effectiveValue = selectedValue ?? items[0]?.value;

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
  },
  pickerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionIndicator: {
    top: '50%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  picker: {
    width: '100%',
  },
  pickerItem: {
    fontSize: 18,
    color: '#1A1A1A',
  },
});

export default MyPicker;
