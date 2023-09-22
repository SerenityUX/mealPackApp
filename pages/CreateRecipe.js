import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, Button, TextInput } from 'react-native';
import { Camera } from 'expo-camera';
import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function CreateRecipeScreen({ navigation, route }) {
    const headerHeight = useHeaderHeight();
    const [height, setHeight] = useState('');
    const [width, setWidth] = useState('');


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

    const newIngredientRef = useRef(null);
    useEffect(() => {
      if (autoFocusNewIngredient && newIngredientRef.current) {
        newIngredientRef.current.focus();
        setAutoFocusNewIngredient(false);  // Reset for next time
      }
    }, [autoFocusNewIngredient]);
    useEffect(() => {
      //handler to get device Height
      setHeight(Dimensions.get('window').height);
      //handler to get device Width
      setWidth(Dimensions.get('window').width);
    }, []);
    const [thumbnail, setThumbnail] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [directions, setDirections] = useState([]);
    const [message, setMessage] = useState("Submit Recipe");

    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [image, setImage] = useState(null);
    const [imageStatus, setImageStatus] = useState("hidden");
  
    const [type, setType] = useState(Camera.Constants.Type.back);
  
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState('');

    const [newDirection, setNewDirection] = useState('');
    const [autoFocusNewIngredient, setAutoFocusNewIngredient] = useState(false);
    const newIngredientsSubmission = [... ingredients, newIngredient]
    const newDirectionsSubmission = [... directions, newDirection]

    const handleUpdateDirection = (text, index) => {
      const newDirections = [...directions];
      newDirections[index] = text;
      setDirections(newDirections);
    };
    
    const handleDeleteDirection = (index) => {
      const newDirections = [...directions];
      newDirections.splice(index, 1);
      setDirections(newDirections);
    };
    
    const handleAddDirection = () => {
      if (newDirection.trim() !== '') { // Fixed the variable name here
        const newDirections = [...directions, newDirection]; // Fixed the variable name here
        setDirections(newDirections);
        setNewDirection('');
      }
    };
    

    const handleUpdateIngredient = (text, index) => {
      const newIngredients = [...ingredients];
      newIngredients[index] = text;
      setIngredients(newIngredients);
    };
  
    const handleDeleteIngredient = (index) => {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    };
  

    const addNewIngredient = () => {
      setIngredients([...ingredients, ""]);
    };
  
    const updateIngredient = (index, value) => {
      const newIngredients = [...ingredients];
      newIngredients[index] = value;
      setIngredients(newIngredients);
    };
  
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission
        addNewIngredient(); // Add new input field
      }
    };

    const handleAddIngredient = () => {
      if (newIngredient.trim() !== '') {
        const newIngredients = [...ingredients, newIngredient];
        setIngredients(newIngredients);
        setNewIngredient('');

      }
    };
    
    async function submitRecipe() {
        setMessage("Loading")
        // Create a new FormData object
        const formData = new FormData();
        formData.append('token', token); 
        formData.append('name', name); 
        formData.append('thumbnail', thumbnail); 
        formData.append('description', description); 
        if(newIngredient != "") {
          formData.append('ingredients', JSON.stringify(newIngredientsSubmission)); 

        } else {
          formData.append('ingredients', JSON.stringify(ingredients)); 

        }
        if(newDirection != "") {
          formData.append('directions', JSON.stringify(newDirectionsSubmission)); 

        } else {
          formData.append('directions', JSON.stringify(directions)); 

        }

        console.log(formData)
        fetch("https://meal-pack-api-serenityux.vercel.app/createRecipe", {
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
            setMessage("Submitted")
            // const newRecipes = [... recipes]
            // let newRecipe = data
            // newRecipe.directions =  directions
            // newRecipes.ingredients = ingredients
            
            // console.log(newRecipe)
            // newRecipes.push(newRecipe)

            // setRecipes(newRecipes)
            navigation.navigate("Home")



        })
          .catch((error) => {
            console.error('Error fetching data:', error);
            setMessage("Invalid Login, Try Again")
          });
    }
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
          console.error('Error converting image to Base64:', error);
          return null;
        }
      }
      
      
        // Define the API endpoint URL where you want to send the POST request
        const apiUrl = 'https://api.imgbb.com/1/upload?key=ead0a21c5c06b9811d5cd0bf4556140d';
      
        // Rest of your code...
      
        const takePicture = async () => {
            if (camera) {
              const data = await camera.takePictureAsync(null);
              setImage(data.uri);
              setImageStatus("Loading");
          
              // Assuming you have a data URI for the image
              const imageDataUri = data.uri;
          
              convertImageToBase64(imageDataUri)
                .then(base64String => {
                  if (base64String) {
                    // Create a FormData object to send the image data
                    const formDataImage = new FormData();
                    formDataImage.append('image', base64String);
          
                    fetch(apiUrl, {
                      method: 'POST',
                      body: formDataImage,
                    })
                      .then(response => {
                        if (response.ok) {
                          return response.json(); // Parse the response as JSON if necessary
                        } else {
                          // Handle error responses here
                          return response.json();
                        }
                      })
                      .then(data => {
                        // Handle the response data here
                        console.log(data.data.url);
                        setThumbnail(data.data.url); // Set the thumbnail state after successful upload
                          console.log("aye")
                      
                        setImageStatus("Complete");
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
          };
      
       if (hasCameraPermission === false) {
          return <Text>No access to camera</Text>;
        }
      
        useEffect(() => {
            (async () => {
              const cameraStatus = await Camera.requestCameraPermissionsAsync();
              console.log('Camera permission status:', cameraStatus.status);
              setHasCameraPermission(cameraStatus.status === 'granted');
            })();
          }, []);
          
    return (
        <KeyboardAwareScrollView
        style={{backgroundColor: "#fff"}}
        extraHeight={120}
        >

  {image == null ? (
  <View style={{width: "100%", marginTop: headerHeight, aspectRatio: 3/4, position: 'relative'}}>
  <Camera 
           ref={ref => setCamera(ref)}
           style={{width: "100%", aspectRatio: 3/4}} 
           type={type}
           ratio={'3:4'} />
   <TouchableOpacity
               onPress={() => {
                 setType(
                   type === Camera.Constants.Type.back
                     ? Camera.Constants.Type.front
                     : Camera.Constants.Type.back
                 );
               }}
   >
   <Image 
   source={{uri: "https://cloud-crhe67f3k-hack-club-bot.vercel.app/0flipicon.png"}}
   style={{
     position: "absolute",
     bottom: 24,
     left: 16,
     width: 48,
     height: 48
   }}
   />
   </TouchableOpacity>
   <TouchableOpacity
               onPress={() => {
                 takePicture()
               }}
   >
   <Image 
   source={{uri: "https://cloud-8k6ayhjse-hack-club-bot.vercel.app/0snap2.png"}}
   style={{
     position: "absolute",
     bottom: 16,
     left: (width/2) - 32,
     width: 64,
     height: 64
   }}
   />
   </TouchableOpacity>
 </View>
  ) : 
  (
  <View style={{position: "relative", marginTop: headerHeight}}>
    <Image style={{width: "100%", aspectRatio: 3/4}} source={{uri: image}}/>
    {thumbnail == "" ? (
    <Text style={{position: "absolute", top: 16, left: 16, color: "#C6512C", backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24, overflow: "hidden"}}>Saving...</Text>
    ) : (
      <Text style={{position: "absolute", top: 16, left: 16, color: "#C6512C", backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24, overflow: "hidden"}}>Saved</Text>

    )}
    {thumbnail != "" &&
    <TouchableOpacity onPress={() => 
      {
        setImage(null)
      setThumbnail("")
    }
    }>
    <Image style={{position: 'absolute', width: 48, height: 48, bottom: 24, left: 16}} source={{uri: "https://cloud-9bvbff0o3-hack-club-bot.vercel.app/0frame_38.png"}}/>
    </TouchableOpacity>
    }
    </View>
  )}


     {/* <Button title="Take Picture" onPress={() => takePicture()} /> */}
     {/* {image && <Image source={{uri: image}} style={{flex:1, borderRadius: 0, overflow: "hidden", opacity: imageStatus == "Loading" ? (0.5) : (1)}}/>} */}
          
            {/* <TextInput
                style={{
                width: 200,
                height: 40,
                borderColor: 'gray',
                borderWidth: 1,
                paddingHorizontal: 10,
                }}
                onChangeText={(text) => setThumbnail(text)}
                value={thumbnail}
            /> */}

            <View style={{marginLeft: 16, marginRight: 16}}>
            <Text style={{fontWeight: 500, fontSize: 18, marginBottom: 8, marginTop: 16}}>Recipe Title</Text>
            <TextInput
          placeholder='Delicious Meal'
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
            />

            <Text style={{fontWeight: 500, fontSize: 18, marginBottom: 8, marginTop: 16}}>Description</Text>
            <TextInput
                      placeholder='Story Behind The Dish'

                style={{
                width: "100%",
                height: 96,
                fontSize: 16,
                padding: 16,
                paddingTop: 16,
                borderRadius: 16,
                borderColor: '#ABABAB',
                borderWidth: 1,
                }}
                multiline={true}
                onChangeText={(description) => setDescription(description)}
                value={description}
            />
            <Text style={{fontWeight: 500, fontSize: 18, marginTop: 16}}>Ingredients</Text>

{ingredients.map((ingredient, i) => (
        <IngredientInput
          key={i}
          ingredient={ingredient}
          onUpdate={(text) => handleUpdateIngredient(text, i)}
          onDelete={() => handleDeleteIngredient(i)}
        />
      ))}

      <TextInput
      returnKeyType="next"
        style={{
          width: "100%",
          padding: 16,
          fontSize: 16,
          borderRadius: 16,
          borderColor: '#ABABAB',
          borderWidth: 1,
          marginTop: 16,
        }}
        onChangeText={setNewIngredient}
        value={newIngredient}
        blurOnSubmit={false}
        ref={newIngredientRef}
        placeholder="+ New Ingredient"
        onSubmitEditing={handleAddIngredient} 
      />





<Text style={{fontWeight: 500, fontSize: 18, marginTop: 16}}>Directions</Text>
{directions.map((direction, i) => (
        <DirectionInput
          key={i}
          direction={direction}
          onUpdate={(text) => handleUpdateDirection(text, i)}
          onDelete={() => handleDeleteDirection(i)}
        />
      ))}
      <TextInput
      returnKeyType="next"
        style={{
          width: "100%",
          padding: 16,
          fontSize: 16,
          borderRadius: 16,
          borderColor: '#ABABAB',
          borderWidth: 1,
          marginTop: 16,
        }}
        onChangeText={setNewDirection}
        value={newDirection}
        blurOnSubmit={false}
        placeholder="+ New Direction"
        onSubmitEditing={handleAddDirection} // Call handleAddIngredient on Enter
      />
    <View style={{marginBottom: 64}}>
    <TouchableOpacity 
    disabled={thumbnail == "" || name == "" || description == "" || (ingredients.length == 0 && newIngredient == "") || (directions.length == 0 && newDirection == "")}
    style={{marginTop: 24, opacity: thumbnail == "" || name == "" || description == "" || (ingredients.length == 0 && newIngredient == "") || (directions.length == 0 && newDirection == "")}}
    onPress={() => submitRecipe()}>
      <Text style={{fontSize: 18, width: "100%", textAlign: "center", color: "#fff", borderRadius: 16, overflow: "hidden", backgroundColor: "#C6512C", padding: 16}}>
        {message}
      </Text>
    </TouchableOpacity>
</View>
</View>
        </KeyboardAwareScrollView>
        
        
    )
}

const IngredientInput = ({ ingredient, onUpdate, onDelete, autoFocus }) => {
  const inputRef = useRef(null);

  // // Use useEffect to autofocus on the input element when autoFocus is true
  // React.useEffect(() => {
  //   if (autoFocus && inputRef.current) {
  //     inputRef.current.focus();
  //   }
  // }, [autoFocus]);
  
  return (
    <View style={{position: "relative", marginTop: 16}}>
      <TextInput
        ref={inputRef}

        style={{
          width: "100%",
          padding: 16,
          fontSize: 16,
          borderRadius: 16,
          borderColor: '#ABABAB',
          borderWidth: 1
        }}
        onChangeText={onUpdate}
        value={ingredient}
      />
      <TouchableOpacity style={{position: "absolute", right: 8, bottom: 4}} onPress={onDelete}>
        <Image style={{width: 42, height: 42}} source={{uri: "https://cloud-cub9i1ik4-hack-club-bot.vercel.app/0trash2.png"}}/>
      </TouchableOpacity>
    </View>
  );
};


const DirectionInput = ({ direction, onUpdate, onDelete, autoFocus }) => {
  const inputRef = useRef(null);

  // Use useEffect to autofocus on the input element when autoFocus is true
  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  return (
    <View style={{position: "relative", marginTop: 16}}>
      <TextInput
        ref={inputRef}
        style={{
          width: "100%",
          padding: 16,
          fontSize: 16,
          borderRadius: 16,
          borderColor: '#ABABAB',
          borderWidth: 1
        }}
        onChangeText={(text) => onUpdate(text)} // Update this line to pass the text to onUpdate
        value={direction}
      />
      <TouchableOpacity style={{position: "absolute", right: 8, bottom: 4}} onPress={onDelete}>
        <Image style={{width: 42, height: 42}} source={{uri: "https://cloud-cub9i1ik4-hack-club-bot.vercel.app/0trash2.png"}}/>
      </TouchableOpacity>
    </View>
  );
};
