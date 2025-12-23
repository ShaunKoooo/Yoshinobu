import { useState, useCallback } from 'react';

/**
 * useConfirmableModal - 統一處理 BottomSheetModal 的確認邏輯
 *
 * 這個 Hook 提供暫存狀態管理，確保只有在用戶按下「確認」後才套用變更
 *
 * @example 單個值的情況
 * const serviceModal = useConfirmableModal(serviceId, setServiceId);
 *
 * <BottomSheetModal
 *   visible={serviceModal.isOpen}
 *   onClose={serviceModal.handleCancel}
 *   onConfirm={serviceModal.handleConfirm}
 * >
 *   <MyPicker
 *     selectedValue={serviceModal.tempValue}
 *     onValueChange={serviceModal.setTempValue}
 *   />
 * </BottomSheetModal>
 *
 * @example 多個值的情況
 * const timeModal = useConfirmableModal(
 *   { date: bookingDate, time: bookingTime },
 *   (values) => {
 *     setBookingDate(values.date);
 *     setBookingTime(values.time);
 *   }
 * );
 *
 * <Calendar onDayPress={(day) => timeModal.setTempValue({ ...timeModal.tempValue, date: day.dateString })} />
 * <TimeSlot onPress={(time) => timeModal.setTempValue({ ...timeModal.tempValue, time })} />
 */
export function useConfirmableModal<T>(
  value: T,
  onConfirm: (value: T) => void,
  options?: {
    onOpen?: () => void;
    onCancel?: () => void;
    customConfirmHandler?: (tempValue: T) => boolean | void; // 返回 false 表示不關閉 modal
  }
) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState<T>(value);

  // 開啟 modal
  const handleOpen = useCallback(() => {
    setTempValue(value); // 初始化暫存值為當前值
    setIsOpen(true);
    options?.onOpen?.();
  }, [value, options]);

  // 確認並套用變更
  const handleConfirm = useCallback(() => {
    // 如果有自定義確認處理器，先執行它
    if (options?.customConfirmHandler) {
      const shouldClose = options.customConfirmHandler(tempValue);
      // 如果返回 false，則不關閉 modal
      if (shouldClose === false) {
        return;
      }
    }

    onConfirm(tempValue);
    setIsOpen(false);
  }, [tempValue, onConfirm, options]);

  // 取消並丟棄變更
  const handleCancel = useCallback(() => {
    setTempValue(value); // 重置暫存值
    setIsOpen(false);
    options?.onCancel?.();
  }, [value, options]);

  return {
    isOpen,
    tempValue,
    setTempValue,
    handleOpen,
    handleConfirm,
    handleCancel,
  };
}
