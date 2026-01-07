import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from 'src/theme';
import { Notification } from 'src/services/api/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

interface NotificationItemProps {
    item: Notification;
    onPress: (item: Notification) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = React.memo(({ item, onPress }) => {
    const {
        sender_name,
        created_at,
        read,
        record_text,
        category,
        image_url,
        title,
    } = item;

    const timeAgo = useMemo(() => moment(created_at).fromNow(), [created_at]);

    const getIconName = () => {
        switch (category) {
            default: return 'bell-outline';
        }
    };

    const getMessage = () => {
        if (record_text) return record_text;

        switch (category) {
            case 'contract_visit': return title;
            default: return '有一則新通知';
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, !read && styles.unreadContainer]}
            onPress={() => onPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.avatarContainer}>
                {image_url ? (
                    <Image source={{ uri: image_url }} style={styles.avatar} />
                ) : (
                    <View style={styles.iconPlaceholder}>
                        <Icon name={getIconName()} size={24} color={Colors.white} />
                    </View>
                )}
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.senderName} numberOfLines={1}>{sender_name || 'System'}</Text>
                    <Text style={styles.time}>{timeAgo}</Text>
                </View>

                <Text style={[styles.message, !read && styles.unreadMessage]} numberOfLines={2}>
                    {getMessage()}
                </Text>
            </View>

            {!read && <View style={styles.dot} />}
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        alignItems: 'center',
    },
    unreadContainer: {
        backgroundColor: '#F9FAFB',
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E5E5E5',
    },
    iconPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
        alignItems: 'center',
    },
    senderName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        marginRight: 8,
    },
    time: {
        fontSize: 12,
        color: '#999',
    },
    message: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    unreadMessage: {
        color: '#333',
        fontWeight: '500',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        marginLeft: 8,
    },
});
