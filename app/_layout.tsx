/* eslint-disable import/no-duplicates */
import { config } from '@gluestack-ui/config'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { Stack } from 'expo-router'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const RootLayout = () => {
  return (
    <>
      <SafeAreaProvider>
        <GluestackUIProvider config={config}>
          <Stack>
            <Stack.Screen name='(tabs)' options={{ headerShown: false, headerTitle: 'Back' }} />
            <Stack.Screen name='[detail]' options={{ headerTitle: 'Detail' }} />
          </Stack>
        </GluestackUIProvider>
      </SafeAreaProvider>
    </>
  )
}

export default RootLayout
