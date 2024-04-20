/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, Heading, Image, Pressable, Text, View } from '@gluestack-ui/themed'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Link } from 'expo-router'
import { cloneDeep } from 'lodash'
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'

import jsonData from '@/db.json'

export type Watch = {
  id: string
  watchName: string
  price: number
  description?: string
  brandName: string
  automatic: boolean
  image: string
  feedbacks?: {
    rating: number
    comment: string
    author: string
    date: string
  }[]
}

export const Item = ({
  watchName,
  price,
  brandName,
  image,
  onChangeFavList,
  favorite
}: {
  watchName: string
  price: number
  brandName: string
  image: string
  favorite: boolean
  onChangeFavList: () => void
}) => {
  useEffect(() => {}, [favorite])

  return (
    <Card m='$2' p='$4' width='45%'>
      <Link href={`/${watchName}`} asChild>
        <Pressable>
          <View style={{ display: 'flex', alignItems: 'center' }}>
            <Image alt={watchName} size='xl' mb='$3' source={{ uri: image }} />
            <Heading mb='$3' size='md'>
              {watchName}
            </Heading>
          </View>
          <View style={{ alignSelf: 'flex-start' }}>
            <Text size='sm'>${price}</Text>
            <Text size='sm'>Brand: {brandName}</Text>
            <Pressable mt='$4' onPress={onChangeFavList} alignSelf='baseline'>
              {favorite ? (
                <Icon size={25} name='heart' color='#b700ff' />
              ) : (
                <Icon size={25} name='hearto' color='#b700ff' />
              )}
            </Pressable>
          </View>
        </Pressable>
      </Link>
    </Card>
  )
}

const HomeScreen = () => {
  const getItem = async () => {
    try {
      const result = await AsyncStorage.getItem('favorite')
      return result === null ? [] : JSON.parse(result)
    } catch (e) {
      console.log(e)
    }
  }

  const isInFavoriteList = (watchName: string) => {
    try {
      return (
        favoriteList.findIndex((watch) => {
          return watch.watchName === watchName
        }) !== -1
      )
    } catch (error) {
      return false
    }
  }

  const handleFavoriteList = async (item: Watch) => {
    try {
      if (isInFavoriteList(item.watchName)) {
        const updatedFavoriteWatches = favoriteList.filter((watch) => watch.id !== item.id)
        await AsyncStorage.setItem('favorite', JSON.stringify(updatedFavoriteWatches))
        setFavoriteList(updatedFavoriteWatches)
      } else {
        setFavoriteList([...favoriteList, item])
        await AsyncStorage.setItem('favorite', JSON.stringify([...favoriteList, item]))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const brands = ['Citizen', 'Tissot', 'Fossil', 'Seiko', 'Frederique Constant']
  const loadData: Watch[] = cloneDeep(jsonData)
  const [data, setData] = useState<Watch[]>(loadData)
  const [favoriteList, setFavoriteList] = useState<Watch[]>([])
  const [brand, setBrand] = useState('')

  useEffect(() => {
    ;(async () => {
      const data = await getItem()
      setFavoriteList(data)
    })()
  }, [getItem()])

  return (
    <View>
      <View m='$3' flexDirection='row' flexWrap='wrap' justifyContent='center'>
        <Button
          softShadow='1'
          width='45%'
          onTouchStart={() => {
            setBrand('')
            setData(loadData)
          }}
          bg='white'
          m='$2'
          p='$1'
          size='xl'
        >
          <Text>All</Text>
        </Button>
        {brands.map((value, i) => (
          <Button
            softShadow='1'
            width='45%'
            key={i}
            onTouchStart={() => {
              setBrand(value)
            }}
            onTouchEnd={() => {
              setData(loadData.filter((value) => value.brandName === brand))
            }}
            bg='white'
            m='$2'
            p='$1'
            size='xl'
          >
            <Text textAlign='center'>{value}</Text>
          </Button>
        ))}
      </View>
      <FlatList
        numColumns={2}
        horizontal={false}
        data={data}
        columnWrapperStyle={{
          justifyContent: 'center',
          alignItems: 'stretch'
        }}
        ListFooterComponent={<View style={{ height: 250 }} />}
        renderItem={({ item }) => (
          <Item
            favorite={isInFavoriteList(item.watchName)}
            image={item.image}
            brandName={item.brandName}
            price={item.price}
            watchName={item.watchName}
            onChangeFavList={() => handleFavoriteList(item)}
          />
        )}
      />
    </View>
  )
}

export default HomeScreen
