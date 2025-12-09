import { CustomerFormField } from './types';

export const CUSTOMER_FIELDS: CustomerFormField[] = [
  {
    key: 'name',
    title: '客戶姓名',
    placeholder: '請輸入',
    type: 'textInput',
  },
  {
    key: 'phone',
    title: '客戶電話',
    placeholder: '請輸入',
    type: 'textInput',
  },
  {
    key: 'birthday',
    title: '生日',
    placeholder: '請選擇',
    type: 'button',
  },
  {
    key: 'address',
    title: '聯絡地址',
    placeholder: '請輸入',
    type: 'textInput',
  },
  {
    key: 'note',
    title: '特殊備註',
    placeholder: '請輸入',
    type: 'textInput',
  },
];
