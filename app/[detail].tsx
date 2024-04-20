import { Text } from '@gluestack-ui/themed'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'

const WatchDetail = () => {
  const { detail } = useLocalSearchParams()
  return <Text>{detail}</Text>
}

export default WatchDetail
