/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Text, View } from '@gluestack-ui/themed'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { cloneDeep } from 'lodash'
import { useState, useEffect } from 'react'
import { FlatList } from 'react-native'

import { Item, Watch } from '.'

import jsonData from '@/db.json'

const FavoriteListScreen = () => {
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

  // const brands = ['Citizen', 'Tissot', 'Fossil', 'Seiko', 'Frederique Constant']
  // const loadData: Watch[] = cloneDeep(jsonData)
  // const [data, setData] = useState<Watch[]>(loadData)
  const [favoriteList, setFavoriteList] = useState<Watch[]>([])
  // const [brand, setBrand] = useState('')

  useEffect(() => {
    ;(async () => {
      const data = await getItem()
      setFavoriteList(data)
    })()
  }, [getItem()])

  return (
    <View>
      {/* <View m='$3' flexDirection='row' flexWrap='wrap' justifyContent='center'>
        <Button
          softShadow='1'
          width='45%'
          onTouchStart={() => {
            setBrand('')
            setFavoriteList(favoriteList)
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
              setFavoriteList(favoriteList.filter((value) => value.brandName === brand))
            }}
            bg='white'
            m='$2'
            p='$1'
            size='xl'
          >
            <Text textAlign='center'>{value}</Text>
          </Button>
        ))}
      </View> */}
      <FlatList
        numColumns={2}
        horizontal={false}
        data={favoriteList}
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

export default FavoriteListScreen
