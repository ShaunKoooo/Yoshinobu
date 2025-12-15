import { CustomerFormField } from './types';

export const CUSTOMER_FIELDS: CustomerFormField[] = [
  {
    key: 'name',
    title: '客戶姓名',
    placeholder: '請輸入',
    nonEditPlaceholder: '未輸入',
    type: 'textInput',
  },
  {
    key: 'mobile',
    title: '客戶電話',
    placeholder: '請輸入',
    nonEditPlaceholder: '未輸入',
    type: 'textInput',
  },
  {
    key: 'email',
    title: '客戶電子郵件',
    placeholder: '請輸入',
    nonEditPlaceholder: '未輸入',
    type: 'textInput',
  },
  {
    key: 'birthday',
    title: '生日',
    placeholder: '請選擇',
    nonEditPlaceholder: '未輸入',
    type: 'button',
    modalType: 'calendar',
  },
  {
    key: 'gender',
    title: '性別',
    placeholder: '請選擇',
    nonEditPlaceholder: '未輸入',
    type: 'button',
    modalType: 'picker',
    pickerItems: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
  {
    key: 'address',
    title: '聯絡地址',
    placeholder: '請輸入',
    nonEditPlaceholder: '未輸入',
    type: 'textInput',
  },
  {
    key: 'note',
    title: '特殊備註',
    placeholder: '請輸入',
    nonEditPlaceholder: '未輸入',
    type: 'textInput',
  },
];
