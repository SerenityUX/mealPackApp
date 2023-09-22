
import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, Text, Dimensions, SafeAreaView, Image, Button, TouchableOpacity, ScrollView, Touchable } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import addIcon from '../assets/symbols/addIcon.svg'; // Adjust the import path as needed
import CachedImage from '../components/cachedImage'

export default function HomeScreen({ navigation }) {
  const [self, setSelf] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');

  useEffect(() => {
    //handler to get device Height
    setHeight(Dimensions.get('window').height);
    //handler to get device Width
    setWidth(Dimensions.get('window').width);
  }, []);

  async function retrieveToken() {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        console.log('Token retrieved securely:', token);
         return token;
      } else {
        console.log('No token found.');
        return null;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
       return null;
    }
  }
  

  async function deleteToken() {
    try {
      await SecureStore.deleteItemAsync('authToken');
      console.log('Token deleted.');
    } catch (error) {
      console.error('Error deleting token:', error);
    }
  }
  
  async function getSelf(token) {
    const formData = new FormData();
    formData.append('token', token); // Use the email state
  
    fetch("https://meal-pack-api-serenityux.vercel.app/auth", {
      method: 'POST',
      body: formData, // Use the FormData object as the request body
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse the JSON response
          
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .then((data) => {
        console.log(data); // Log the data for debugging
        setSelf(data)
        setRecipes(data.recipes)
        
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        navigation.navigate("Welcome")
      });
  }


  useFocusEffect(
    useCallback(() => {
      async function retrieveTokenOnFocus() {
        const storedToken = await SecureStore.getItemAsync('authToken');
        if (storedToken) {
          console.log(storedToken)
          getSelf(storedToken);
        } else {
          navigation.navigate("Login")
        }
      }
  
      retrieveTokenOnFocus();
    }, [])
  );
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", display: "flex", justifyContent: "flex-start", alignItems: 'center'}}>
        <View>
        <View style={{display:"flex", justifyContent: "flex-start", flexDirection: "row", width: "100%"}}>
          
          <View style={{display: "flex", width: "100%", alignItems: 'center', flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={{fontSize: 32, lineHeight: 42, fontWeight: "500", marginBottom: 8, marginLeft: 16}}>Meal Pack</Text>
          <View style={{
                      marginRight: 16,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      

          }}>

          <TouchableOpacity
        style={{
          alignItems: "center",
          display: "flex",
        }}
        title="Create Recipe"
        onPress={() => {
        
            navigation.navigate('CreateRecipe', {
              token: self?.token
            })
          
      }}
      >
      <CachedImage
        style={{ width: 48, height: 48 }}
        source={{uri: "https://cloud-ip3xbaidj-hack-club-bot.vercel.app/0add_box.png"}}
      />
      
      </TouchableOpacity>
      <TouchableOpacity
              onPress={() => {
                deleteToken().then(() => {
                  setSelf({})
                  navigation.navigate('Login')
                })}}
      >
      <CachedImage
        style={{ width: 36, height: 36, borderRadius: 24, padding: 16, marginLeft: 12 }}
        source={{uri: self.avatar}}
      />
      </TouchableOpacity>
      </View>


      </View>
        </View>
        {recipes.length == 0 &&
        <Text style={{fontSize: 18, marginLeft: 16}}>You have no recipes... go make some!</Text>
        }
        <FlatList

        style={{width: width - 32, paddingTop: 8, marginLeft: 16, marginRight: 16}}
          data={recipes}
          renderItem={({ index, item }) => (
            <TouchableOpacity
            key={item.id}
            onPress={() =>
              navigation.navigate('Recipe', {
                recipe: item,
                token: self.token,
              })
            }
            style={{
              flex: 1,
              flexDirection: 'column',
              marginRight: index % 2 !== 0 ? 0 : 8,
              marginLeft: index % 2 === 0 ? 0 : 8,
              marginBottom: 16,
              borderRadius: 16,
              overflow: 'hidden',
              maxWidth: (width - 40) / 2,
              position: 'relative', // Add this to create a stacking context
            }}
          >
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              zIndex: 2,
              display: "flex",
              padding: 12,
              flexDirection: "row",
              gap: "8px"
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,

                fontWeight: 500 
              }}
            >
              {item.name}
            </Text>
            </View>
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 2,
              display: "flex",
              padding: 12,
              alignItems: 'center',
              flexDirection: "row",
              gap: "8px"
            }}>
            <CachedImage 
            contentFit="cover"
            style={{width: 24, 
              borderColor: "rgba(255, 255, 255, 0.5)",
              borderWidth: 1,
              alignItems: "center",

              height: 24, borderRadius: 32}} src={item.author.avatar}/>
            <Text
              style={{
                color: '#fff',
                fontSize: 16,

                fontWeight: 500 
              }}
            >
              {item.author.name.split(" ")[0]}
            </Text>
            </View>
            <LinearGradient
              colors={[
                'rgba(0, 0, 0, 0.90)',
                
                'rgba(0, 0, 0, 0.45)',
                'rgba(0, 0, 0, 0.00)',
                'rgba(0, 0, 0, 0.45)',
                'rgba(0, 0, 0, 0.90)',
              ]}
              locations={[0, 0.1615, 0.4948, 0.8073, 1]}
              style={{
                flex: 1,
                zIndex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
            <CachedImage
              style={{
                aspectRatio: 3 / 4,
                position: 'relative',
              }}
              source={{ uri: item.thumbnail }}
            />
          </TouchableOpacity>
          )}
          //Setting the number of column
          numColumns={2}
          keyExtractor={(item, index) => index}
        />
        
        {/* {recipes?.map((recipe) => 
        <TouchableOpacity
          key={recipe.id}
          onPress={() =>
            navigation.navigate('Recipe', {
              recipe: recipe,
              token: self.token
            })
          }
          style={{
            aspectRatio: 3/4,
            backgroundColor: "#000",
            width: {}
          }}
        >
          <Image style={{width: 150, height: 200}} src={recipe.thumbnail}/>

          <Text>{recipe.name}</Text>
          <Image style={{width: 64, height: 64, borderRadius: 32}} src={recipe.author.avatar}/>
          <Text>{recipe.author.name}</Text>
        </TouchableOpacity>
        )} */}


</View>
      </SafeAreaView>
    );
  }