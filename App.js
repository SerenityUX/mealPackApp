import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './pages/Home';
import LoginScreen from './pages/Login';
import * as SecureStore from 'expo-secure-store';
import SignupScreen from './pages/Signup';
import RecipeScreen from './pages/Recipe';
import CreateRecipeScreen from './pages/CreateRecipe';
import WelcomeScreen from './pages/Welcome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  const [initialRouteName, setInitialRouteName] = useState(''); // Default to 'Login'

  useEffect(() => {
    // Check if a token exists in SecureStore
    async function checkIfHasToken() {
      const authToken = await SecureStore.getItemAsync('authToken');
      if (authToken) {
        setInitialRouteName('Home'); // Set to 'Home' if a token exists
      } else {
        setInitialRouteName('Welcome'); // Otherwise, set to 'Login'
      }
    }

    checkIfHasToken();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false // This hides the header for all screens in the stack
        }}
      >
      <Tab.Screen 
  name="HomeStack" 
  component={HomeStackScreen} 
  options={{
    tabBarLabel: 'Home'
    // tabBarIcon: ({ color, size }) => (
    //   <SomeIconComponent name="home" color={color} size={size} />
    // ),
  }}
/>        
<Tab.Screen name="Profile" component={CreateRecipeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function HomeStackScreen() {
  const [initialRouteName, setInitialRouteName] = useState(''); // Default to 'Login'

  useEffect(() => {
    // Check if a token exists in SecureStore
    async function checkIfHasToken() {
      const authToken = await SecureStore.getItemAsync('authToken');
      if (authToken) {
        setInitialRouteName('Home'); // Set to 'Home' if a token exists
      } else {
        setInitialRouteName('Welcome'); // Otherwise, set to 'Login'
      }
    }

    checkIfHasToken();
  }, []);

  return (
   
         initialRouteName != "" && (initialRouteName == "Welcome" ? (

<Stack.Navigator  initialRouteName={initialRouteName}
          
screenOptions={{
  headerTintColor: '#C6512C',
  
  headerTitleStyle: {
    color: "#000"
  },
  headerBackTitleVisible: false,
  headerTransparent: true,
  headerBlurEffect: "prominent",
}}
>
<Stack.Screen options={{headerShown: false}} name="Welcome" component={WelcomeScreen} />

        <Stack.Screen name="Home" component={HomeScreen} options={{ 
          title: 'Recipes',
          headerLargeTitle: true,
          headerLargeTitleStyle: {
            fontSize: 32,
            fontWeight: "600",
          },
          headerStyle: {
            height: 100, // Adjust the header height as needed
          },
          headerTransparent: true,
          headerBackTitleVisible: false,
          headerShown: false
      

         }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen options={({ route }) => ({ title: route.params.recipe.name })} name="Recipe" component={RecipeScreen} />
        <Stack.Screen options={{ title: "Create A Recipe" }} name="CreateRecipe" component={CreateRecipeScreen} />

        </Stack.Navigator>


        ) : (
          <Stack.Navigator initialRouteName={initialRouteName}
          
          screenOptions={{
            headerTintColor: '#C6512C',
            headerTitleStyle: {
              color: "#000"
            },
            headerBackTitleVisible: false,
            headerTransparent: true,
            headerBlurEffect: "prominent",
          }}
          >
<Stack.Screen options={{headerShown: false}} name="Welcome" component={WelcomeScreen} />

        <Stack.Screen name="Home" component={HomeScreen} options={{ 
          title: 'Recipes',
          headerLargeTitle: true,
          headerLargeTitleStyle: {
            fontSize: 32,
            fontWeight: "600",
          },
          headerStyle: {
            height: 100, // Adjust the header height as needed
          },
          headerTransparent: true,
          headerBackTitleVisible: false,
          headerShown: false
      
      }} />

        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen options={({ route }) => ({ title: route.params.recipe.name })} name="Recipe" component={RecipeScreen} />
        <Stack.Screen options={{ title: "Create A Recipe" }} name="CreateRecipe" component={CreateRecipeScreen} />

        </Stack.Navigator>

        )
        )
  );
}

export default App;
