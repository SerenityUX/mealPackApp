
import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image, Button, TextInput } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Camera } from 'expo-camera';
import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function SignupScreen({ navigation }) {
  const headerHeight = useHeaderHeight();
  const nameRef = useRef(null);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);


  const styles = StyleSheet.create({
    cameraContainer: {
        marginLeft: 16,
        position: "relative",
        marginRight: 16,
        marginTop: 16,
        flexDirection: 'row',
        aspectRatio: 1,

        borderRadius: "320px",
        overflow: "hidden"

    },
    fixedRatio:{
        flex: 1,
        aspectRatio: 1,

    }
  })
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [imageStatus, setImageStatus] = useState("hidden");

  const [type, setType] = useState(Camera.Constants.Type.front);

// Define a function to convert the image to Base64
async function convertImageToBase64(uri) {
  try {
    // Fetch the image as a binary blob
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error('Failed to fetch the image');
    }
    
    // Read the image data as a blob
    const blob = await response.blob();

    // Create a FileReader to read the blob as Base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result.split(',')[1]); // Extract the Base64 portion
        } else {
          reject(new Error('Failed to read image as Base64'));
        }
      };
      reader.onerror = () => {
        reject(new Error('Error reading image'));
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    // console.error('Error converting image to Base64:', error);
    return null;
  }
}


  // Define the API endpoint URL where you want to send the POST request
  const apiUrl = 'https://api.imgbb.com/1/upload?key=ead0a21c5c06b9811d5cd0bf4556140d';

  // Rest of your code...

  const takePicture = async () => {
    if(image != null) {
      setImage(null)
    }

    if (camera && image == null) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
      setImageStatus("Loading")
      // Assuming you have a data URI for the image
      const imageDataUri = data.uri;

      convertImageToBase64(imageDataUri)
        .then(base64String => {
          if (base64String) {
            // Create a FormData object to send the image data
            const formData = new FormData();
            formData.append('image', base64String);

            fetch(apiUrl, {
              method: 'POST',
              body: formData,
            })
              .then(response => {
                if (response.ok) {
                  // Request was successful
                  return response.json(); // Parse the response as JSON if necessary
                } else {
                  // Handle error responses here
                  return response.json();
                }
              })
              .then(data => {
                // Handle the response data here
                console.log(data.data.url)
                setImage(data.data.url)
                setAvatar(data.data.url)
                setImageStatus("Complete")
              })
              .catch(error => {
                // Handle any errors that occurred during the fetch
                console.error('Error:', error);
              });
            // You can use the Base64 string as needed (e.g., for API requests or displaying the image)
          } else {
            console.log('Image conversion failed.');
          }
        });
    }
  }

 if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  useEffect(() => {
      (async () => {
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');
  })();
    }, []);

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
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');


    const [token, setToken] = useState('');
    const [message, setMessage] = useState('Signup');


    function signup() {
        setMessage("Loading")
        // Create a new FormData object
        const formData = new FormData();
        formData.append('email', email.toLocaleLowerCase()); 
        formData.append('password', password); 
        formData.append('name', name); 
        formData.append('avatar', avatar); 

        fetch("https://meal-pack-api-serenityux.vercel.app/signup", {
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
            setMessage("Logged In")
            storeToken(data).then(() => {
                navigation.navigate("Home")
            })
            
        })
          .catch((error) => {
            // console.error('Error fetching data:', error);
            setMessage("Invalid Account, Try Again")
          });
      }
      
            
    return (
      <KeyboardAwareScrollView style={{backgroundColor: "#fff"}}>
      <View style={{ flex: 1, marginTop: headerHeight, height: "100%", backgroundColor: "#fff", }}>


        <View style={{ aspectRatio: 1, display: "flex", alignItems: "center"}}>
        <TouchableOpacity
   onLongPress={ () =>  
    {
      if(image != null) {
        setImage(null)
      } else {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    )}}
  } 
   onPress={() => takePicture()}
   >

   <View style={styles.cameraContainer}>
    {!image ?
       (
       <Camera 
            ref={ref => setCamera(ref)}
            style={styles.fixedRatio} 
            type={type}
            ratio={'1:1'} />
            ) :
            (
              <Image source={{uri: image}} style={styles.fixedRatio}/>
            )
    }
    </View>
    </TouchableOpacity>   

    {/* <Button
            title="Flip Image"
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
     </Button>
     <Button title="Take Picture" onPress={() => takePicture()} />   */}
</View>

<Text style={{width: "100%", fontSize: 16, textAlign: "center"}}>Tap Image to Capture</Text>

<Text style={{width: "100%", fontSize: 16, textAlign: "center"}}>Hold Image to Flip</Text>
      <View style={{marginLeft: 16, marginRight: 16}}>
      <Text style={{fontWeight: 500, fontSize: 18, marginBottom: 8, marginTop: 16}}>Name</Text>
            <TextInput
            ref={emailRef}
          placeholder='Marsha Mellow'
          onSubmitEditing={() => emailRef.current.focus()}
          style={{
                width: 200,
                width: "100%",
                fontSize: 16,
                padding: 16,
                borderRadius: 16,
                borderColor: '#ABABAB',
                borderWidth: 1,
                }}
                onChangeText={(text) => setName(text)}
                value={name}
                autoComplete="name"
                textContentType="name"
                keyboardType="default"
                returnKeyType={"next"}
                spellCheck={false}
            />


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

textContentType={"newPassword"}
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
            />


<TouchableOpacity
onPress={() => signup()}
style={{marginTop: 24, opacity: email == "" || password == "" || image == null || avatar == "" || name == "" ? 0.5 : 1 }}
disabled={email == "" || password == "" || image == null || avatar == "" || name == ""}
      >
            <Text style={{fontSize: 18, width: "100%", textAlign: "center", color: "#fff", borderRadius: 16, overflow: "hidden", backgroundColor: "#C6512C", padding: 16}}>
        {message}

      </Text>
      </TouchableOpacity>
              <TouchableOpacity
              
              style={{marginTop: 16}}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={{fontSize: 16, marginBottom: 64, textAlign: "center", color: "#C6512C"}}>Already Have An Account? Login</Text>
  </TouchableOpacity>
      </View>
      </View>
      </KeyboardAwareScrollView>
    );
  }