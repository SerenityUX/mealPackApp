
import React, { useState, useRef } from 'react';
import { View, Text,TouchableOpacity, Button, TextInput } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useHeaderHeight } from '@react-navigation/elements';

export default function LoginScreen({ navigation }) {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);



    async function storeToken(token) {
        try {
          await SecureStore.setItemAsync('authToken', token);
          console.log('Token stored securely');
        } catch (error) {
          console.error('Error storing token:', error);
        }
      }    



    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('Login');


    function login() {
        setMessage("Loading")
        // Create a new FormData object
        const formData = new FormData();
        formData.append('email', email.toLocaleLowerCase()); // Use the email state
        formData.append('password', password); // Use the password state
      
        fetch("https://meal-pack-api-serenityux.vercel.app/login", {
          method: 'POST',
          body: formData, // Use the FormData object as the request body
        })
          .then((response) => {
            if (response.ok) {
              return response.text(); // Parse the JSON response
              
            } else {
              throw new Error('Network response was not ok');
            }
          })
          .then((data) => {
            console.log(data); // Log the data for debugging
            setMessage("Logged In")
            storeToken(data).then(() => {
                setEmail("")
                setPassword("")
                setMessage("Login")
                emailRef.current.focus()
                navigation.navigate("Home")
            })
            
        })
          .catch((error) => {
            setMessage("Invalid Login, Try Again")
          });
      }
      const headerHeight = useHeaderHeight();

            
    return (
      <View style={{ flex: 1, paddingTop: headerHeight, paddingLeft: 16, paddingRight: 16, backgroundColor: "#fff", display: "flex", justifyContent: 'flex-start' }}>
        <Text style={{fontSize: 32, marginBottom: 12, fontWeight: 500}}>Welcome Back</Text>
        <Text style={{fontWeight: 500, fontSize: 18, marginBottom: 8, marginTop: 16}}>Email Address</Text>
            <TextInput
            ref={emailRef}
          placeholder='marsha@mellow.app'
          onSubmitEditing={() => passwordRef.current.focus()}
          style={{
                width: 200,
                width: "100%",
                fontSize: 16,
                padding: 16,
                borderRadius: 16,
                borderColor: '#ABABAB',
                borderWidth: 1,
                }}
                onChangeText={(text) => setEmail(text)}
                value={email}
                autoComplete={"email"}
                inputMode={"email"}
                textContentType={"emailAddress"}
                keyboardType={"email-address"}
                returnKeyType={"next"}
                spellCheck={false}
            />

                    <Text style={{fontWeight: 500, fontSize: 18, marginBottom: 8, marginTop: 16}}>Password</Text>
            <TextInput
secureTextEntry={true}
ref={passwordRef}

textContentType={"password"}
          placeholder='tastySpice'
          spellCheck={false}

          style={{
                width: 200,
                width: "100%",
                
                fontSize: 16,
                padding: 16,
                borderRadius: 16,
                borderColor: '#ABABAB',
                borderWidth: 1,
                }}
                onChangeText={(text) => setPassword(text)}
                value={password}
                autoComplete={"current-password"}
            />

        <TouchableOpacity
        disabled={email == "" || password == ""}

  style={{marginTop: 24, opacity: email == "" || password == "" ? 0.5 : 1}}
onPress={() => login()}
      >
            <Text style={{fontSize: 18, width: "100%", textAlign: "center", color: "#fff", borderRadius: 16, overflow: "hidden", backgroundColor: "#C6512C", padding: 16}}>
        {message}

      </Text>
      </TouchableOpacity>
              <TouchableOpacity
              style={{marginTop: 16}}
        title={"Don't Have Account? Signup"}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={{fontSize: 16, textAlign: "center", color: "#C6512C"}}>Don't Have An Account? Signup</Text>
  </TouchableOpacity>
      </View>
    );
  }