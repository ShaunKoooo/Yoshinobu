import React from 'react';
import { View } from 'react-native';
import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';

export function GluestackUIProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <View style={{ flex: 1 }}>
      <OverlayProvider>
        <ToastProvider>{children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
