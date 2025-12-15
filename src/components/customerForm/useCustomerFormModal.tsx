import { useState, useCallback, useMemo } from 'react';
import { Calendar } from 'react-native-calendars';
import { BottomSheetModal, MyPicker } from 'src/components';
import { CUSTOMER_FIELDS } from './constants';

interface UseCustomerFormModalProps {
  formValues: Record<string, string>;
  onFieldChange: (key: string, value: string) => void;
}

export const useCustomerFormModal = ({
  formValues,
  onFieldChange,
}: UseCustomerFormModalProps) => {
  const [activeModal, setActiveModal] = useState<{
    type: 'calendar' | 'picker' | null;
    fieldKey: string;
  } | null>(null);

  const handleButtonPress = useCallback((key: string) => {
    const field = CUSTOMER_FIELDS.find((f) => f.key === key);
    if (field?.modalType) {
      setActiveModal({ type: field.modalType, fieldKey: key });
    }
  }, []);

  const handleModalClose = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleModalConfirm = useCallback(() => {
    setActiveModal(null);
  }, []);

  // Memoized modal content to avoid unnecessary re-renders
  const modalContent = useMemo(() => {
    if (!activeModal) return null;

    const field = CUSTOMER_FIELDS.find((f) => f.key === activeModal.fieldKey);

    switch (activeModal.type) {
      case 'calendar':
        const currentValue = formValues[activeModal.fieldKey];
        return (
          <Calendar
            initialDate={currentValue || undefined}
            markedDates={{
              [currentValue]: {
                selected: true,
                disableTouchEvent: true,
              },
            }}
            onDayPress={(day) => {
              onFieldChange(activeModal.fieldKey, day.dateString);
            }}
          />
        );

      case 'picker':
        return (
          <MyPicker
            items={field?.pickerItems || []}
            selectedValue={formValues[activeModal.fieldKey]}
            onValueChange={(value) => {
              onFieldChange(activeModal.fieldKey, value as string);
            }}
          />
        );

      default:
        return null;
    }
  }, [activeModal, formValues, onFieldChange]);

  // Modal component to render
  const ModalComponent = activeModal ? (
    <BottomSheetModal
      visible={true}
      onClose={handleModalClose}
      onConfirm={handleModalConfirm}
    >
      {modalContent}
    </BottomSheetModal>
  ) : null;

  return {
    handleButtonPress,
    ModalComponent,
  };
};
