import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MyPicker } from 'src/components';
import { Colors } from 'src/theme';

interface YearMonthSelectorProps {
    year: number;
    month: number;
    onYearChange: (year: number) => void;
    onMonthChange: (month: number) => void;
    yearItems: { label: string; value: number }[];
    monthItems: { label: string; value: number }[];
}

export const YearMonthSelector = memo(({
    year,
    month,
    onYearChange,
    onMonthChange,
    yearItems,
    monthItems,
}: YearMonthSelectorProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.pickerRow}>
                <View style={styles.pickerWrapper}>
                    <Text style={styles.pickerLabel}>年份</Text>
                    <MyPicker
                        items={yearItems}
                        selectedValue={year}
                        onValueChange={(value) => onYearChange(Number(value))}
                    />
                </View>
                <View style={styles.pickerWrapper}>
                    <Text style={styles.pickerLabel}>月份</Text>
                    <MyPicker
                        items={monthItems}
                        selectedValue={month}
                        onValueChange={(value) => onMonthChange(Number(value))}
                    />
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        // Ensuring basic container styling if needed, currently wrapper
    },
    pickerRow: {
        flexDirection: 'row',
        gap: 16,
        paddingHorizontal: 16,
    },
    pickerWrapper: {
        flex: 1,
    },
    pickerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
});
