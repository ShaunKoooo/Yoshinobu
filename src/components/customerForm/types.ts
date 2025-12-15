export interface CustomerFormField {
  title: string;
  placeholder?: string;
  type: 'textInput' | 'button';
  key: string;
  nonEditPlaceholder?: string;
}

export interface CustomerFormProps {
  editable: boolean;
  fields: CustomerFormField[];
  values: Record<string, string>;
  onFieldChange?: (key: string, value: string) => void;
  onButtonPress?: (key: string) => void;
}

export interface CustomerFormData {
  name: string;
  phone: string;
  birthday: string;
  address: string;
  note: string;
}
