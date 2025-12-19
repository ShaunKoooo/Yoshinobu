import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppConfig } from 'src/config/AppConfig';
import { Colors } from 'src/theme';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const isSPAApp = AppConfig.APP_TYPE === 'spa';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  // 根據 APP_TYPE 選擇對應的圖片
  const backgroundImage = isSPAApp
    ? require('../../../assets/spa/home.png')
    : require('../../../assets/bb/home.png');

  const handleBooking = () => {
    console.log('立即預約');
    navigation.navigate('AddBooking');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover">
        {/* 底部按鈕區域 */}
        <View style={[styles.bottomSection, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity
            style={styles.bookingButton}
            onPress={handleBooking}
            activeOpacity={0.8}>
            <Text style={styles.bookingButtonText}>立即預約</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  bookingButton: {
    backgroundColor: Colors.primary, // #8B7B6E with opacity
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 0,
  },
  bookingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomeScreen;
