import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Colors } from 'src/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.5;

interface BottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  children?: React.ReactNode;
}

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  visible,
  onClose,
  onConfirm,
  children,
}) => {

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={onClose}>
                  <Text style={styles.cancelText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onConfirm}>
                  <Text style={[styles.confirmText]}>確認</Text>
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={styles.content}>
                {children}
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    backgroundColor: '#F2F2F7',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333333',
  },
  cancelText: {
    fontSize: 16,
    color: '#8F9BB3',
  },
  confirmText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.3,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
  },
  placeholder: {
    color: '#C9CDD4',
  },
});

export default BottomSheetModal;
