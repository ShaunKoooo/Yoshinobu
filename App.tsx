import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from 'src/store';
import RootNavigator from 'src/navigation/RootNavigator';

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#000000"
          translucent={false}
        />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
