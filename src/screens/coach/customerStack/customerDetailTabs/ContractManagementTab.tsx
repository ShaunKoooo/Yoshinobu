import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  Accordion,
  Badge,
} from 'src/components';
import { useContracts } from 'src/services/hooks';
import { Colors } from 'src/theme';
import { formatDate } from 'src/utils';
import type { Contract as ApiContract } from 'src/services/api/types';

const ContractManagementTab = ({ route }: any) => {
  const { id } = route.params || {};

  // 使用 useContracts 取得合約列表
  const { data: contractsData, isLoading, error } = useContracts({
    client_id: id,
  });

  const [expandedContracts, setExpandedContracts] = useState<Set<string>>(new Set());

  const toggleContract = (contractId: string) => {
    setExpandedContracts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(contractId)) {
        newSet.delete(contractId);
      } else {
        newSet.add(contractId);
      }
      return newSet;
    });
  };

  const renderContractItem = (contract: ApiContract) => {
    const contractId = contract.id.toString();
    const isExpanded = expandedContracts.has(contractId);

    return (
      <Accordion
        key={contract.id}
        isExpanded={isExpanded}
        onToggle={() => toggleContract(contractId)}
        header={
          <>
            <Text style={styles.contractCustomerId}>{contract.contract_number}</Text>
            <View style={styles.rightSection}>
              {contract.shared && <Badge variant="shared" text="共用" />}
            </View>
          </>
        }>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>創建日期</Text>
          <Text style={styles.detailValue}>{formatDate(new Date(contract.created_at))}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>時間</Text>
          <Text style={styles.detailValue}>{contract.contract_time} 分鐘</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>合約類別</Text>
          <Text style={styles.detailValue}>{contract.category.name}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>照片</Text>
          <Text style={styles.detailValue}></Text>
        </View>
      </Accordion>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>載入中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>載入失敗：{error.message}</Text>
      </View>
    );
  }

  const contracts = contractsData?.contracts || [];

  if (contracts.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyText}>尚無合約資料</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {contracts.map(renderContractItem)}
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
    padding: 20,
  },
  contractItem: {
    justifyContent: 'space-between',
    height: 64,
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
  contractCustomerId: {
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
  rightCustomerId: {
    fontFamily: 'SF Pro',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: 0.5,
    color: '#000000',
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#86909C',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#86909C',
    textAlign: 'center',
  },
  photosContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    fontFamily: 'SF Pro',
    fontSize: 12,
    color: '#8E8E93',
  },
});

export default ContractManagementTab;
