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

interface Contract {
  id: string;
  customerId: string;
  isShared: boolean;
  createdAt: string;
  phone: string;
  name: string;
  contractType: string;
  time: string;
  photos?: string[];
}

const ContractManagementTab = () => {
  // TODO: 從 route params 或 Redux 取得實際的 customer ID 和合約列表
  const customerId = 'C223456789';
  const [contracts] = useState<Contract[]>([
    {
      id: '1',
      customerId: 'C223456789',
      isShared: true,
      createdAt: '2024-01-15',
      phone: '0912-345-678',
      name: '王小明',
      contractType: '月租',
      time: '2024-01-15 ~ 2025-01-14',
      photos: [],
    },
    {
      id: '2',
      customerId: 'C223456789',
      isShared: true,
      createdAt: '2024-01-15',
      phone: '0912-345-678',
      name: '王小明',
      contractType: '月租',
      time: '2024-01-15 ~ 2025-01-14',
      photos: [],
    },
  ]);
  const [expandedContracts, setExpandedContracts] = useState<Set<string>>(new Set(['1']));

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

  const renderContractItem = (contract: Contract) => {
    const isExpanded = expandedContracts.has(contract.id);

    return (
      <Accordion
        key={contract.id}
        isExpanded={isExpanded}
        onToggle={() => toggleContract(contract.id)}
        header={
          <>
            <Text style={styles.contractCustomerId}>{contract.customerId}</Text>
            <View style={styles.rightSection}>
              {contract.isShared && <Badge variant="shared" text="共用" />}
            </View>
          </>
        }>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>創建日期：</Text>
          <Text style={styles.detailValue}>{contract.createdAt}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>電話：</Text>
          <Text style={styles.detailValue}>{contract.phone}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>姓名：</Text>
          <Text style={styles.detailValue}>{contract.name}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>合約類別：</Text>
          <Text style={styles.detailValue}>{contract.contractType}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>時間：</Text>
          <Text style={styles.detailValue}>{contract.time}</Text>
        </View>
        {contract.photos && contract.photos.length > 0 && (
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>照片：</Text>
            <View style={styles.photosContainer}>
              {contract.photos.map((_, index) => (
                <View key={index} style={styles.photoPlaceholder}>
                  <Text style={styles.photoText}>照片 {index + 1}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Accordion>
    );
  };

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
