import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Badge,
  Accordion,
} from 'src/components';

interface VerificationRecord {
  id: string;
  time: string;
  status: 'completed' | 'cancelled' | 'pending';
  serviceItems: string;
  serviceTime: string;
  masseurs: string;
}

const VerificationRecordsTab = () => {
  // TODO: 從 route params 或 Redux 取得實際的核銷紀錄列表
  const [records] = useState<VerificationRecord[]>([
    {
      id: '1',
      time: '2024-01-15 14:30',
      status: 'completed',
      serviceItems: '全身按摩、腳底按摩',
      serviceTime: '2024-01-15 14:30 - 16:00',
      masseurs: '張師傅、李師傅',
    },
    {
      id: '2',
      time: '2024-01-20 10:00',
      status: 'cancelled',
      serviceItems: '肩頸按摩',
      serviceTime: '2024-01-20 10:00 - 11:00',
      masseurs: '王師傅',
    },
    {
      id: '3',
      time: '2024-01-25 16:00',
      status: 'pending',
      serviceItems: '全身按摩、足部護理、精油按摩',
      serviceTime: '2024-01-25 16:00 - 18:00',
      masseurs: '張師傅、李師傅、王師傅',
    },
  ]);
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set(['1']));

  const toggleRecord = (recordId: string) => {
    setExpandedRecords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(recordId)) {
        newSet.delete(recordId);
      } else {
        newSet.add(recordId);
      }
      return newSet;
    });
  };

  const getBadgeVariant = (status: VerificationRecord['status']) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'canceled';
      case 'pending':
        return 'memberPending';
      default:
        return 'memberPending';
    }
  };

  const getBadgeText = (status: VerificationRecord['status']) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      case 'pending':
        return '待服務';
      default:
        return '待服務';
    }
  };

  const renderRecordItem = (record: VerificationRecord) => {
    const isExpanded = expandedRecords.has(record.id);

    return (
      <Accordion
        key={record.id}
        isExpanded={isExpanded}
        onToggle={() => toggleRecord(record.id)}
        header={
          <>
            <Text style={styles.recordTime}>{record.time}</Text>
            <View style={styles.rightSection}>
              <Badge variant={getBadgeVariant(record.status)} text={getBadgeText(record.status)} />
            </View>
          </>
        }>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>服務項目：</Text>
          <Text style={styles.detailValue}>{record.serviceItems}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>服務時間：</Text>
          <Text style={styles.detailValue}>{record.serviceTime}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>按摩師：</Text>
          <Text style={styles.detailValue}>{record.masseurs}</Text>
        </View>
      </Accordion>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {records.map(renderRecordItem)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  recordTime: {
    fontFamily: 'SF Pro',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
    letterSpacing: 0.5,
    color: '#48484A',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  detail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    paddingHorizontal: 16,
  },
  detailLabel: {
    fontFamily: 'SF Pro',
    fontSize: 14,
    fontWeight: '400',
    color: '#48484A',
    width: 90,
  },
  detailValue: {
    fontFamily: 'SF Pro',
    fontSize: 14,
    fontWeight: '400',
    color: '#86909C',
  },
});

export default VerificationRecordsTab;
