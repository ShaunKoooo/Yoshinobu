import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from 'src/store';
import { AuthProvider } from 'src/contexts/AuthContext';
import RootNavigator from 'src/navigation/RootNavigator';
import CodePush from "@code-push-next/react-native-code-push";
import { queryClient } from 'src/services/queryClient';

function App() {
  useEffect(() => {
    CodePush.sync(
      {
        installMode: CodePush.InstallMode.IMMEDIATE,
        updateDialog: {
          title: "Update Available",
          optionalUpdateMessage: "There is a new version. Do you want to update?",
          optionalInstallButtonLabel: "Yes",
          optionalIgnoreButtonLabel: "Later",
        },
      },
      (status) => {
        console.log("Sync status:", status);
      },
      (progress) => {
        console.log(`Received ${progress.receivedBytes} of ${progress.totalBytes}`);
      }
    );
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
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
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
