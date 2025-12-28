import React, {
  useState,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import {
  MyButton,
  Icon,
  BottomSheetModal,
  MyPicker,
} from 'src/components';
import { Colors } from 'src/theme';
import {
  useCategories,
  useCreateContract,
  useFindContractsByMobile,
  useCreateShareContract,
} from 'src/services/hooks';
import { useNavigation } from '@react-navigation/native';
import { useSelectedClientIdFromClients } from 'src/hooks/useClientsWithRedux';
import { useConfirmableModal } from 'src/hooks/useConfirmableModal';

const CreateContractScreen = () => {
  const navigation = useNavigation<any>();
  const { data: categories } = useCategories();
  const createContract = useCreateContract();
  const createShareContract = useCreateShareContract();
  const clientId = useSelectedClientIdFromClients(); // 從 Redux 取得當前選中的 client_id
  const [isSharedContract, setIsSharedContract] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [contractNumber, setContractNumber] = useState('');
  const [contractCategoryId, setContractCategoryId] = useState<number | null>(null);
  const [contractType, setContractType] = useState('');
  const [time, setTime] = useState(60);
  const [showContractFields, setShowContractFields] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<number | null>(null);

  // 查詢合約的 hook，預設不啟用
  const { data: contractsData, refetch: searchContracts, isFetching: isSearching } = useFindContractsByMobile(
    { mobile: phone },
    false // 預設不自動查詢
  );

  // 使用 useConfirmableModal 管理各個 modal
  const categoryModal = useConfirmableModal(contractCategoryId, setContractCategoryId);
  const timeModal = useConfirmableModal(time, setTime);
  const contractModal = useConfirmableModal(selectedContractId, setSelectedContractId);

  // 當 categories 載入後，自動設定第一個為預設值
  useEffect(() => {
    if (categories && categories.length > 0 && contractCategoryId === null) {
      setContractCategoryId(categories[0].id);
    }
  }, [categories, contractCategoryId]);

  // 當切換回非共用合約時，重置顯示狀態和清空查詢資料
  useEffect(() => {
    if (!isSharedContract) {
      setShowContractFields(false);
      setSelectedContractId(null);
      setPhone('');
      setContractNumber('');
      // 重置合約類別為預設值
      if (categories && categories.length > 0) {
        setContractCategoryId(categories[0].id);
      }
      setTime(60);
    }
  }, [isSharedContract, categories]);

  // 當選擇合約後，自動填入合約資料
  useEffect(() => {
    if (selectedContractId && contractsData?.contracts) {
      const selectedContract = contractsData.contracts.find(c => c.id === selectedContractId);
      if (selectedContract) {
        setContractNumber(selectedContract.contract_number || '');
        setContractCategoryId(selectedContract.category_id);
        setTime(selectedContract.contract_time);
      }
    }
  }, [selectedContractId, contractsData]);

  const handleSubmit = () => {
    // 驗證必填欄位
    if (!contractNumber || !contractCategoryId || !time) {
      Alert.alert('錯誤', '請填寫所有必填欄位');
      return;
    }

    // 驗證是否有 client_id
    if (!clientId) {
      Alert.alert('錯誤', '無法取得客戶資訊，請先選擇客戶');
      return;
    }

    // 如果是共用合約，需要驗證是否有選擇合約
    if (isSharedContract && !selectedContractId) {
      Alert.alert('錯誤', '請先選擇合約');
      return;
    }

    // 根據是否為共用合約，呼叫不同的 API
    if (isSharedContract) {
      // 建立共用合約
      createShareContract.mutate(
        {
          client_id: clientId,
          contract_id: selectedContractId!,
          contract_time: time,
        },
        {
          onSuccess: (data) => {
            Alert.alert(
              '建立成功',
              '共用合約已成功建立！',
              [
                {
                  text: '確定',
                  onPress: () => {
                    navigation.goBack();
                    console.log('共用合約建立成功:', data);
                  },
                },
              ]
            );
          },
          onError: (error: any) => {
            Alert.alert(
              '建立失敗',
              error?.message || '建立共用合約時發生錯誤，請稍後再試'
            );
          },
        }
      );
    } else {
      // 建立一般合約
      createContract.mutate(
        {
          client_id: clientId,
          category_id: contractCategoryId,
          contract_time: time,
          contract_number: contractNumber,
        },
        {
          onSuccess: (data) => {
            Alert.alert(
              '建立成功',
              '合約已成功建立！',
              [
                {
                  text: '確定',
                  onPress: () => {
                    navigation.goBack();
                    console.log('合約建立成功:', data);
                  },
                },
              ]
            );
          },
          onError: (error: any) => {
            Alert.alert(
              '建立失敗',
              error?.message || '建立合約時發生錯誤，請稍後再試'
            );
          },
        }
      );
    }
  };

  const categoryItems = categories?.map(category => ({
    label: category.name,
    value: category.id,
  })) || [];

  const timeItems = [30, 60, 90, 120, 180].map(time => ({
    label: time + ' 分鐘',
    value: time,
  })) || [];

  // 準備合約選項列表
  const contractItems = contractsData?.contracts?.map(contract => ({
    label: contract.contract_number || `合約 ${contract.id}`,
    value: contract.id,
  })) || [];

  // 根據 ID 找出對應的 name 來顯示
  const selectedCategory = categories?.find(c => c.id === contractCategoryId);

  const isFormValid = phone && name && contractNumber && contractType && time;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* 共用合約 Toggle */}
        <View style={styles.row}>
          <Text style={styles.label}>共用合約</Text>
          <Switch
            value={isSharedContract}
            onValueChange={setIsSharedContract}
          />
        </View>

        {/* 電話 */}
        {isSharedContract &&
          <View>
            <View style={styles.row}>
              <Text style={styles.label}>電話</Text>
              <TextInput
                style={styles.input}
                placeholder="請輸入"
                placeholderTextColor={Colors.text.placeholder}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.queryButtonContainer}>
              <TouchableOpacity
                style={styles.queryButton}
                onPress={async () => {
                  if (!phone) {
                    Alert.alert('提示', '請先輸入手機號碼');
                    return;
                  }

                  try {
                    const result = await searchContracts();
                    if (result.data) {
                      // 查詢成功，顯示合約欄位
                      setShowContractFields(true);

                      // 如果有合約資料
                      if (result.data.contracts && result.data.contracts.length > 0) {
                        // 自動選擇第一筆合約
                        const firstContract = result.data.contracts[0];
                        setSelectedContractId(firstContract.id);
                        setContractNumber(firstContract.contract_number || '');
                        setContractCategoryId(firstContract.category_id);
                        setTime(firstContract.contract_time);

                        Alert.alert('查詢成功', `找到 ${result.data.contracts.length} 筆合約資料`);
                      } else {
                        Alert.alert('查詢結果', '此手機號碼無合約資料');
                      }
                    }
                  } catch (error) {
                    Alert.alert('查詢失敗', '查詢合約時發生錯誤');
                  }
                }}
                disabled={isSearching}
              >
                <Text style={styles.queryButtonText}>
                  {isSearching ? '查詢中...' : '查詢'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />
          </View>
        }

        {/* 合約號碼 - 當 isSharedContract 為 false 時顯示輸入框，為 true 時顯示選擇器 */}
        {!isSharedContract && (
          <TouchableOpacity style={styles.row}>
            <Text style={styles.label}>合約號碼</Text>
            <TextInput
              style={styles.input}
              placeholder="請輸入"
              placeholderTextColor={Colors.text.placeholder}
              value={contractNumber}
              onChangeText={setContractNumber}
              keyboardType="default"
            />
          </TouchableOpacity>
        )}

        {/* 合約號碼選擇器 - 當 isSharedContract 為 true 且查詢後顯示 */}
        {isSharedContract && showContractFields && (
          <TouchableOpacity
            style={styles.row}
            onPress={contractModal.handleOpen}
          >
            <Text style={styles.label}>合約號碼</Text>
            <View style={styles.selectorContainer}>
              <Text
                style={[
                  styles.selectorText,
                  !contractNumber && styles.placeholderText,
                ]}
              >
                {contractNumber || '請選擇'}
              </Text>
              <Icon name="right-open-big" size={16} />
            </View>
          </TouchableOpacity>
        )}

        {/* 合約類別 - 當 isSharedContract 為 false 時可選擇，為 true 時只讀顯示 */}
        {!isSharedContract && (
          <TouchableOpacity
            style={styles.row}
            onPress={categoryModal.handleOpen}
          >
            <Text style={styles.label}>合約類別</Text>
            <View style={styles.selectorContainer}>
              <Text
                style={[
                  styles.selectorText,
                  !selectedCategory && styles.placeholderText,
                ]}
              >
                {selectedCategory?.name || '請選擇'}
              </Text>
              <Icon name="right-open-big" size={16} />
            </View>
          </TouchableOpacity>
        )}

        {/* 合約類別只讀顯示 - 當 isSharedContract 為 true 且查詢後顯示 */}
        {isSharedContract && showContractFields && (
          <View style={styles.row}>
            <Text style={styles.label}>合約類別</Text>
            <Text
              style={[
                styles.selectorText,
                !selectedCategory && styles.placeholderText,
              ]}
            >
              {selectedCategory?.name || '請選擇'}
            </Text>
          </View>
        )}

        {/* 時間 - 當 isSharedContract 為 false 時可選擇，為 true 時只讀顯示 */}
        {!isSharedContract && (
          <TouchableOpacity
            style={styles.row}
            onPress={timeModal.handleOpen}
          >
            <Text style={styles.label}>時間</Text>
            <View style={styles.selectorContainer}>
              <Text
                style={[
                  styles.selectorText,
                  !time && styles.placeholderText,
                ]}
              >
                {time || '請選擇'}
              </Text>
              <Icon name="right-open-big" size={16} />
            </View>
          </TouchableOpacity>
        )}

        {/* 時間只讀顯示 - 當 isSharedContract 為 true 且查詢後顯示 */}
        {isSharedContract && showContractFields && (
          <View style={styles.row}>
            <Text style={styles.label}>時間</Text>
            <Text
              style={[
                styles.selectorText,
                !time && styles.placeholderText,
              ]}
            >
              {time || '請選擇'}
            </Text>
          </View>
        )}

        {!isSharedContract && <View style={styles.column}>
          <Text style={styles.label}>上傳照片</Text>
          <TouchableOpacity
            style={{ backgroundColor: '#E0E0E0', width: 64, height: 64, justifyContent: 'center', alignItems: 'center', marginTop: 16 }}
          >
            <Text style={{ fontSize: 24, color: '#86909C' }}>+</Text>
          </TouchableOpacity>
        </View>}
      </ScrollView>

      {/* 底部確認按鈕 */}
      <View style={styles.buttonContainer}>
        <MyButton
          isActive={
            !!contractNumber &&
            !!contractCategoryId &&
            !!time &&
            (isSharedContract ? !!selectedContractId : true) &&
            !createContract.isPending &&
            !createShareContract.isPending
          }
          title={
            (createContract.isPending || createShareContract.isPending)
              ? "建立中..."
              : "確認"
          }
          onPress={handleSubmit}
        />
      </View>

      {/* Category Modal */}
      <BottomSheetModal
        visible={categoryModal.isOpen}
        onClose={categoryModal.handleCancel}
        onConfirm={categoryModal.handleConfirm}
      >
        <MyPicker
          items={categoryItems}
          selectedValue={categoryModal.tempValue ?? undefined}
          onValueChange={(value) => categoryModal.setTempValue(Number(value))}
        />
      </BottomSheetModal>

      {/* Time Modal */}
      <BottomSheetModal
        visible={timeModal.isOpen}
        onClose={timeModal.handleCancel}
        onConfirm={timeModal.handleConfirm}
      >
        <MyPicker
          items={timeItems}
          selectedValue={timeModal.tempValue}
          onValueChange={(value) => timeModal.setTempValue(Number(value))}
        />
      </BottomSheetModal>

      {/* Contract Modal - 合約選擇 */}
      <BottomSheetModal
        visible={contractModal.isOpen}
        onClose={contractModal.handleCancel}
        onConfirm={contractModal.handleConfirm}
      >
        <MyPicker
          items={contractItems}
          selectedValue={contractModal.tempValue ?? undefined}
          onValueChange={(value) => contractModal.setTempValue(Number(value))}
        />
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    height: 64,
    borderBottomColor: '#F2F2F7',
  },
  column: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: 136,
    borderBottomColor: '#F2F2F7',
  },
  label: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '400',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'right',
    marginLeft: 16,
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectorText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  placeholderText: {
    color: Colors.text.placeholder,
  },
  buttonContainer: {
    padding: 16,
  },
  divider: {
    height: 8,
  },
  queryButtonContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  queryButton: {
    backgroundColor: Colors.primary || '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  queryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateContractScreen;
