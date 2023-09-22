
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Input, Modal, TouchableOpacity, Text, Image, Button, TextInput } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useHeaderHeight } from '@react-navigation/elements';
import CachedImage from '../components/cachedImage'



export default function RecipeScreen({ navigation, route }) {

    const [message, setMessage] = useState('Share');
    const headerHeight = useHeaderHeight();

    const { recipe, token } = route.params;
    const [recipientEmail, setRecipientEmail] = useState('');
    const [showShareMenu, setShowShareMenu] = useState(false);
    async function share() {
      setMessage("Sharing")
        // Create a new FormData object
        const formData = new FormData();
        formData.append('recipeSent', recipe.id); 
        formData.append('recipientEmail', recipientEmail.toLocaleLowerCase()); 
        formData.append('token', token); 
        console.log(formData)
        fetch("https://meal-pack-api-serenityux.vercel.app/share", {
          method: 'POST',
          body: formData, // Use the FormData object as the request body
        })
          .then((response) => {
            if (response.ok) {
              setMessage("Sent")
                return response.json()
              
            } else {
                const validResponse = response.text()
                console.log(validResponse)
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
    useEffect(() => {
      // Add navigation options dynamically
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => setShowShareMenu(true)}
          >
            <Image width={42} height={42} source={{uri: "https://cloud-omft3jsbn-hack-club-bot.vercel.app/0gift.png"}} />
          </TouchableOpacity>
        ),
      });
    }, [navigation]);

    return (
      <>
          <View
          style={{position: "absolute", width: 260, zIndex: 1, backgroundColor: "#fff", padding: 16, borderRadius: 16,  top: headerHeight + 16, right: 16, display: showShareMenu ? ("display") : ("none")}}
        
      >
        {/* Your share menu content here */}
        <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
          
        <Text style={{fontSize: 16}}>Gift Your Recipe</Text>
        <TouchableOpacity
          onPress={() => setShowShareMenu(false)}
        >
          <Text
          >Close</Text>
        </TouchableOpacity>
        </View>
        <Text style={{fontWeight: 500, fontSize: 16, marginBottom: 8, marginTop: 16}}>Email Address</Text>
            <TextInput
          placeholder='marsha@mellow.app'
          style={{
                width: 200,
                width: "100%",
                fontSize: 16,
                paddingHorizontal: 12,
                paddingVertical: 12,
                borderRadius: 12,
                borderColor: '#ABABAB',
                borderWidth: 1,
                }}
                onChangeText={(text) => setRecipientEmail(text)}
                value={recipientEmail}
                autoComplete={"email"}
                inputMode={"email"}
                textContentType={"emailAddress"}
                keyboardType={"email-address"}
                spellCheck={false}
            />
            <TouchableOpacity
            onPress={() => share()}
            >
            <Text style={{fontSize: 18, width: "100%", textAlign: "center", color: "#fff", borderRadius: 16, overflow: "hidden", backgroundColor: "#C6512C", padding: 12, marginTop: 16}}>
        {message}

      </Text>
      </TouchableOpacity>
      </View>
        <ScrollView style={{backgroundColor: "#fff"}}>
          


          <CachedImage style={{width: "100%", backgroundColor: "#fff", marginTop: headerHeight, aspectRatio: 3/4}} src={recipe.thumbnail}/>
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
            <View style={{marginBottom: 32}}>
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