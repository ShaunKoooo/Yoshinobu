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
} from 'src/services/hooks';
import { useNavigation } from '@react-navigation/native';
import { useSelectedClientIdFromClients } from 'src/hooks/useClientsWithRedux';

const AddContractScreen = () => {
  const navigation = useNavigation<any>();
  const { data: categories } = useCategories();
  const createContract = useCreateContract();
  const clientId = useSelectedClientIdFromClients(); // 從 Redux 取得當前選中的 client_id
  const [isSharedContract, setIsSharedContract] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [contractNumber, setContractNumber] = useState('');
  const [contractCategoryId, setContractCategoryId] = useState<number | null>(null);
  const [contractType, setContractType] = useState('');
  const [time, setTime] = useState(60);
  const [activeModal, setActiveModal] = useState<'category' | 'time' | null>(null);

  // 當 categories 載入後，自動設定第一個為預設值
  useEffect(() => {
    if (categories && categories.length > 0 && contractCategoryId === null) {
      setContractCategoryId(categories[0].id);
    }
  }, [categories, contractCategoryId]);

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
  };

  const categoryItems = categories?.map(category => ({
    label: category.name,
    value: category.id,
  })) || [];

  const timeItems = [30, 60, 90, 120, 180].map(time => ({
    label: time + ' 分鐘',
    value: time,
  })) || [];

  const modalContent = () => {
    switch (activeModal) {
      case 'category':
        return (
          <MyPicker
            items={categoryItems}
            selectedValue={contractCategoryId ?? undefined}
            onValueChange={(value) => { setContractCategoryId(Number(value)); }}
          />
        );
      case 'time':
        return (
          <MyPicker
            items={timeItems}
            selectedValue={time}
            onValueChange={(value) => { setTime(Number(value)); }}
          />
        );
      default:
        return null;
    }
  };

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

            <View style={styles.row}>
              <Text style={styles.label}>姓名</Text>
              <TextInput
                style={styles.input}
                placeholder="請輸入"
                placeholderTextColor={Colors.text.placeholder}
                value={name}
                onChangeText={setName}
                keyboardType="default"
              />
            </View>
            <View style={styles.divider} />
          </View>
        }

        {/* 合約號碼 */}
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

        {/* 合約類別 */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => setActiveModal('category')}
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

        {/* 時間 */}
        <TouchableOpacity
          style={styles.row}
          onPress={() => setActiveModal('time')}
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
          isActive={!!contractNumber && !!contractCategoryId && !!time && !createContract.isPending}
          title={createContract.isPending ? "建立中..." : "確認"}
          onPress={handleSubmit}
        />
      </View>

      <BottomSheetModal
        visible={activeModal != null}
        onClose={() => { setActiveModal(null); }}
        onConfirm={() => { setActiveModal(null); }}
        children={modalContent()}
      />
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
  }
});

export default AddContractScreen;
