
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Input, Modal, TouchableOpacity, Text, Image, Button, TextInput } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useHeaderHeight } from '@react-navigation/elements';
import CachedImage from '../components/cachedImage'



export default function RecipePreviewScreen({ navigation, route }) {

    const [message, setMessage] = useState('Add To Meal Pack');
    const headerHeight = useHeaderHeight();

    const { recipe, token } = route.params;
    const [recipientEmail, setRecipientEmail] = useState('');
    const [showShareMenu, setShowShareMenu] = useState(false);

    async function add() {
      setMessage("Adding To Meal Pack...")
        // Create a new FormData object
        const formData = new FormData();
        formData.append('recipe', recipe.id); 
        formData.append('token', token); 
        // console.log(formData)
        fetch("https://meal-pack-api-serenityux.vercel.app/add", {
          method: 'POST',
          body: formData, // Use the FormData object as the request body
        })
          .then((response) => {
            if (response.ok) {
              setMessage("Added To Meal Pack")
                return response.json()
              
            } else {
                const validResponse = response.text()
                // console.log(validResponse)
                setMessage("Try again")
                return validResponse
            }
          })
          .then((data) => {
            console.log(data); // Log the data for debugging
        
        })
          .catch((error) => {
            console.error('Error sharing:', error);
          });
      }
    // useEffect(() => {
    //   // Add navigation options dynamically
    //   navigation.setOptions({
    //     headerRight: () => (
    //       <TouchableOpacity
    //         onPress={() => setShowShareMenu(true)}
    //       >
    //         <Image width={42} height={42} source={{uri: "https://cloud-omft3jsbn-hack-club-bot.vercel.app/0gift.png"}} />
    //       </TouchableOpacity>
    //     ),
    //   });
    // }, [navigation]);

    return (
      <>

      
            <TouchableOpacity 
            onPress={() => add()}
            style={{position: "absolute", width: "100%", display: "flex", flex: 1, bottom: 32, zIndex: 5}}>

            <Text style={{fontSize: 18, textAlign: "center", marginLeft: 16, marginRight: 16, color: "#fff", borderRadius: 16, overflow: "hidden", backgroundColor: "#C6512C", padding: 16}}>

          {message}</Text>
        
      </TouchableOpacity>
        <ScrollView style={{backgroundColor: "#fff"}}>
          


          <CachedImage style={{width: "100%", backgroundColor: "#fff", marginTop: headerHeight - 8, aspectRatio: 3/4}} src={recipe.thumbnail}/>
            <View style={{margin: 16}}>
            <Text style={{fontSize: 32, marginBottom: 12, fontWeight: 500}}>{recipe?.name}</Text>
            <View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "8px"}}>
            <CachedImage style={{width: 32, height: 32, borderRadius: 16}} src={recipe?.author?.avatar}/>
            <Text style={{fontSize: 18}}>{recipe?.author?.name}</Text>
            </View>
            <Text style={{marginTop: 16, fontSize: 16, lineHeight: 18, marginBottom: 16}}>{recipe?.description}</Text>
            <View style={{marginBottom: 4}}>

            <Text style={{fontSize: 24, marginBottom: 16, fontWeight: 500}}>Ingredients</Text>
            {recipe?.ingredients?.map((ingredient, i) => 
                <Text style={{fontSize: 18,  marginBottom: 12}} key={ingredient}>• {ingredient}</Text>
            )}
            </View>
            <View style={{marginBottom: 72}}>
            <Text style={{fontSize: 24, marginBottom: 16, fontWeight: 500}}>Directions</Text>

            {recipe?.directions?.map((direction, i) => 
                <Text style={{fontSize: 18, marginBottom: 12}} key={direction}>{i + 1}. {direction}</Text>
            )}
            </View>
            {/* <Text>Share email</Text>
            <TextInput
        style={{
          width: 200,
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          paddingHorizontal: 10,
        }}
        onChangeText={(text) => setRecipientEmail(text)}
        value={recipientEmail}
      />
      <Button onPress={() => share()} title={message}/> */}
      </View>
        </ScrollView>
        </>
    )
}