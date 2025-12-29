import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from 'src/theme';

export type BadgeVariant = 'shared' | 'reserved' | 'completed' | 'memberPending' | 'canceled';

interface BadgeProps {
  variant: BadgeVariant;
  text: string;
}

const Badge = ({ variant, text }: BadgeProps) => {
  return (
    <View style={[styles.badge, styles[variant]]}>
      <Text style={[styles.badgeText, styles[`${variant}Text`]]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    minHeight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontFamily: 'Noto Sans TC',
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 14,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  // 共用
  shared: {
    borderColor: Colors.primary,
  },
  sharedText: {
    color: Colors.primary,
  },
  // 已預約
  reserved: {
    borderColor: Colors.primary,
  },
  reservedText: {
    color: Colors.primary,
  },
  // 已完成
  completed: {
    borderColor: '#28C76F',
  },
  completedText: {
    color: '#28C76F',
  },
  // 會員待核銷
  memberPending: {
    borderColor: '#FF9F43',
  },
  memberPendingText: {
    color: '#FF9F43',
  },
  // 已取消
  canceled: {
    borderColor: '#C9CDD4',
  },
  canceledText: {
    color: '#C9CDD4',
  },
});

export default Badge;
