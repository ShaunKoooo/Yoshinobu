import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Icon from '../FontelloIconByName';

interface AccordionProps {
  isExpanded: boolean;
  onToggle: () => void;
  header: ReactNode;
  children: ReactNode;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  showArrow?: boolean;
}

const Accordion = ({
  isExpanded,
  onToggle,
  header,
  children,
  headerStyle,
  contentStyle,
  showArrow = true,
}: AccordionProps) => {
  return (
    <View>
      <TouchableOpacity
        style={[styles.header, headerStyle]}
        onPress={onToggle}
        activeOpacity={0.7}>
        {showArrow && (
          <Icon
            name={isExpanded ? 'down-dir' : 'right-dir'}
            size={16}
            color="#B49162"
            style={styles.arrow}
          />
        )}
        {header}
      </TouchableOpacity>

      {isExpanded && (
        <View style={[styles.content, contentStyle]}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  arrow: {
    marginRight: 8,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
});

export default Accordion;
