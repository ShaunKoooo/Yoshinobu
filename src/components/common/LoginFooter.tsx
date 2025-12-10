import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from 'src/theme';

const LoginFooter = () => {
  return (
    <View style={styles.footerContainer}>
      <View style={styles.footerTextContainer}>
        <Text style={styles.footerText}>無障礙行前表示您同意 </Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>使用者條款(EULA)</Text>
        </TouchableOpacity>
        <Text style={styles.footerText}>與</Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>隱私權政策</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footerVersionContainer}>
        <Text style={styles.footerVersion}>V3.4.10-202110613</Text>
        <TouchableOpacity style={styles.updateButton}>
          <Text style={[styles.footerVersion, styles.updateText]}>
            檢查程式更新
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 'auto',
    paddingTop: 40,
  },
  footerTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 16,
  },
  footerLink: {
    color: Colors.primary,
    fontSize: 12,
  },
  footerVersionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerVersion: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  updateButton: {
    marginLeft: 10,
  },
  updateText: {
    color: Colors.primary,
  },
});

export default LoginFooter;
