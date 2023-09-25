import { View, FlatList,  SafeAreaView, TouchableOpacity, Dimensions, StyleSheet, Text, Image, Button, TextInput } from 'react-native';
import { useState, useCallback, useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import welcomeGif from '../assets/welcome.gif'
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import CachedImage from '../components/cachedImage'

export default function Discover({ navigation }) {
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

  useFocusEffect(
    useCallback(() => {
      async function retrieveTokenOnFocus() {
        const storedToken = await SecureStore.getItemAsync('authToken');
        if (storedToken) {
          console.log(storedToken)
          getSelf(storedToken);
        } else {
          
          navigation.navigate("SetupStack")
        }
      }
  
      retrieveTokenOnFocus();
    }, [])
  );
      
      async function getSelf(token) {
        const formData = new FormData();
        formData.append('token', token); // Use the email state
      
        fetch("https://meal-pack-api-serenityux.vercel.app/discover", {
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
            setRecipes(data.suggestedRecipes)
            
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            navigation.navigate("SetupStack")
          });

          
      }

      
    return(
        <SafeAreaView style={{backgroundColor: "#fff", height: "100%"}}>
            <View style={{marginLeft: 16, marginRight: 16}}>
            <Text style={{fontSize: 32, lineHeight: 42, fontWeight: "500", marginBottom: 8}}>Discover Recipes</Text>

            </View>
            <FlatList

style={{width: width, paddingTop: 8, paddingLeft: 16, paddingRight: 16}}
  data={recipes}
  renderItem={({ index, item }) => (
    <TouchableOpacity
    key={item.id}
    onPress={() =>
      navigation.navigate('RecipePreview', {
        recipe: item,
        token: self.token,
      })
    }
    style={{
      flex: 1,
      flexDirection: 'column',
      marginBottom: 24,
      borderRadius: 32,
      overflow: 'hidden',
      maxWidth: width,
      position: 'relative', // Add this to create a stacking context
    }}
  >
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      zIndex: 2,
      display: "flex",
      padding: 24,
      flexDirection: "row",
      gap: "8px"
    }}>
    <Text
      style={{
        color: '#fff',
        fontSize: 24,

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
      padding: 24,
      alignItems: 'center',
      flexDirection: "row",
      gap: "8px"
    }}>
    <CachedImage 
    contentFit="cover"
    style={{width: 32, 
      borderColor: "rgba(255, 255, 255, 0.5)",
      borderWidth: 1,
      alignItems: "center",

      height: 32, borderRadius: 32}} src={item.author.avatar}/>
    <Text
      style={{
        color: '#fff',
        fontSize: 18,

        fontWeight: 500 ,
        textShadowColor: 'rgba(0, 0, 0, 1.0)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 8
      }}
    >
      {item.author.name.split(" ")[0]}
    </Text>
    </View>
    {/* <LinearGradient
      colors={[
        'rgba(0, 0, 0, 0.30)',
        'rgba(0, 0, 0, 0.20)',
        'rgba(0, 0, 0, 0.00)',
        'rgba(0, 0, 0, 0.20)',
        'rgba(0, 0, 0, 0.30)',
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
    /> */}
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
  numColumns={1}
  keyExtractor={(item, index) => index}
/>
        </SafeAreaView>
    )
}