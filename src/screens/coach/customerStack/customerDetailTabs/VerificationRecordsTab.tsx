import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  Badge,
  Accordion,
} from 'src/components';
import { useContractVisits } from 'src/services/hooks/useContractVisits';
import type { ContractVisit } from 'src/services/api/types';
import { formatDate, formatTime } from 'src/utils';

interface VerificationRecord {
  id: string;
  time: string;
  status: 'completed' | 'cancelled' | 'pending';
  serviceItems: string;
  serviceTime: string;
  masseurs: string;
}

const VerificationRecordsTab = ({ route }: any) => {
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set());
  const { id } = route.params || {};
  // 取得當前日期並格式化為 YYYY-MM-DD
  const toDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  // 調用 API
  const { data: contractVisits, isLoading, error } = useContractVisits({
    from_date: '2025-01-01',
    to_date: toDate,
    status: 'completed',
    client_id: id,
  });

  // 將 API 數據轉換為顯示格式
  const records = useMemo(() => {
    if (!contractVisits) return [];

    return contractVisits.map((visit: ContractVisit): VerificationRecord => {
      const visitDetail = visit.visit;
      const serviceName = visitDetail.service_name || '-';
      const providerName = visitDetail.provider_name || '-';

      // 格式化為 YYYY-MM-DD HH:MM
      const formatDateTime = (isoString: string) => {
        if (!isoString) return '';
        const dateObj = new Date(isoString);
        return `${formatDate(dateObj)} ${formatTime(isoString)}`;
      };

      // 使用 check_in_time 或 time 作為開始時間
      const startTime = visitDetail.check_in_time || visitDetail.time;
      const duration = visitDetail.duration;

      let displayTime = '';
      let serviceTime = '';

      if (startTime) {
        displayTime = formatDateTime(startTime);
        serviceTime = duration.toString() + ' 分鐘';
      }

      return {
        id: visit.id.toString(),
        time: displayTime,
        status: visit.status as 'completed' | 'cancelled' | 'pending',
        serviceItems: serviceName,
        serviceTime,
        masseurs: providerName,
      };
    });
  }, [contractVisits]);

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
            <Text style={styles.recordTime}>{record.time || '-'}</Text>
            <View style={styles.rightSection}>
              <Badge variant={getBadgeVariant(record.status)} text={getBadgeText(record.status)} />
            </View>
          </>
        }>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>服務項目</Text>
          <Text style={styles.detailValue}>{record.serviceItems}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>服務時間</Text>
          <Text style={styles.detailValue}>{record.serviceTime}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>按摩師</Text>
          <Text style={styles.detailValue}>{record.masseurs}</Text>
        </View>
      </Accordion>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>載入失敗，請稍後再試</Text>
      </View>
    );
  }

  if (records.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyText}>目前沒有核銷紀錄</Text>
      </View>
    );
  }

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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'SF Pro',
    fontSize: 16,
    fontWeight: '400',
    color: '#FF3B30',
  },
  emptyText: {
    fontFamily: 'SF Pro',
    fontSize: 16,
    fontWeight: '400',
    color: '#86909C',
  },
  recordTime: {
    fontFamily: 'SF Pro',
    fontSize: 14,
    fontWeight: '700',
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
