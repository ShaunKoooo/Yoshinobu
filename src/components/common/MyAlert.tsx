import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Colors } from 'src/theme';

interface MyAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onCancel?: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  customContent?: React.ReactNode;
}

const MyAlert: React.FC<MyAlertProps> = ({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  cancelText,
  confirmText,
  customContent,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Title */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
              </View>

              {/* Message */}
              <View style={styles.messageContainer}>
                <Text style={styles.message}>{message}</Text>
              </View>

              {/* Custom Content */}
              {customContent && (
                <View style={styles.customContentContainer}>
                  {customContent}
                </View>
              )}

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                {cancelText && <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onCancel}
                >
                  <Text style={styles.cancelButtonText}>{cancelText}</Text>
                </TouchableOpacity>}

                {cancelText && <View style={styles.buttonDivider} />}

                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={onConfirm}
                >
                  <Text style={styles.confirmButtonText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  titleContainer: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  messageContainer: {
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDivider: {
    width: 1,
    backgroundColor: '#E5E5EA',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    fontSize: 17,
    color: '#86909C',
    fontWeight: '400',
  },
  confirmButton: {
    backgroundColor: '#FFFFFF',
  },
  confirmButtonText: {
    fontSize: 17,
    color: '#4E5969',
    fontWeight: '600',
  },
  customContentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
});

export default MyAlert;
