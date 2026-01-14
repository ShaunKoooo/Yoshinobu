import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
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
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

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
          <Text style={styles.detailValue}>{contract.category?.name}</Text>
        </View>
        {contract.upload_file_urls && contract.upload_file_urls.length > 0 && (
          <View style={[styles.detail, { height: 'auto', minHeight: 64, paddingVertical: 16 }]}>
            <Text style={styles.detailLabel}>照片</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScrollView}>
              {contract.upload_file_urls.map((url, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedImageUrl(url)}>
                  <Image
                    source={{ uri: url }}
                    style={styles.photoThumbnail}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
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
    <View style={styles.container}>
      <ScrollView>
        {contracts.map(renderContractItem)}
      </ScrollView>

      {/* Image Preview Modal - 照片放大預覽 */}
      <Modal
        visible={!!selectedImageUrl}
        transparent={true}
        onRequestClose={() => {
          setSelectedImageUrl(null);
          setImageLoading(true);
        }}
        animationType="fade"
      >
        <View style={styles.imagePreviewContainer}>
          <TouchableOpacity
            style={styles.imagePreviewBackdrop}
            activeOpacity={1}
            onPress={() => {
              setSelectedImageUrl(null);
              setImageLoading(true);
            }}
          >
            <View style={styles.imagePreviewContent}>
              {selectedImageUrl && (
                <Image
                  source={{ uri: selectedImageUrl }}
                  style={styles.previewImage}
                  resizeMode="contain"
                  onLoadStart={() => {
                    console.log('圖片開始載入');
                    setImageLoading(true);
                  }}
                  onLoad={() => {
                    console.log('圖片載入完成');
                    setImageLoading(false);
                  }}
                  onLoadEnd={() => {
                    console.log('圖片載入結束');
                    setImageLoading(false);
                  }}
                  onError={(e: any) => {
                    console.log('圖片載入錯誤:', e.nativeEvent?.error);
                    setImageLoading(false);
                  }}
                />
              )}
              <TouchableOpacity
                onPress={() => {
                  setSelectedImageUrl(null);
                  setImageLoading(true);
                }}
                style={styles.closePreviewButton}
              >
                <Text style={styles.closePreviewButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
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
  photosScrollView: {
    flex: 1,
  },
  photoThumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 8,
  },
  imagePreviewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewBackdrop: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreviewContent: {
    width: '90%',
    height: '70%',
    position: 'relative',
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  closePreviewButton: {
    position: 'absolute',
    top: -50,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closePreviewButtonText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default ContractManagementTab;
