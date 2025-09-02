import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as rtl from '@testing-library/react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Provide a simple mock for useSafeAreaInsets in case components call it
jest.mock('react-native-safe-area-context', () => {
  const actual = jest.requireActual('react-native-safe-area-context');
  return {
    ...actual,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    SafeAreaProvider: ({ children }: any) => children,
  };
});

// Mock react-native-render-html to render the provided html as plain Text
jest.mock('react-native-render-html', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ source }: any) =>
    React.createElement(Text, null, source?.html || '');
});

// Provide a minimal expo-router mock for usePathname and router
jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  usePathname: () => '',
}));

export function render(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <SafeAreaProvider>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </SafeAreaProvider>
    );
  };

  return rtl.render(ui, { wrapper: Wrapper });
}

export const waitFor = rtl.waitFor;
export const fireEvent = rtl.fireEvent;
export const act = rtl.act;
export const within = rtl.within;
export const screen = rtl.screen;
