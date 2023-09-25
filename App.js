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
import RecipePreviewScreen from './pages/RecipePreview';
import CreateRecipeScreen from './pages/CreateRecipe';
import DiscoverScreen from './pages/Discover';
import { BottomTabBar } from '@react-navigation/bottom-tabs';

import WelcomeScreen from './pages/Welcome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        tabBar={(props) => {
          // Get the current route name
          const routeName = props?.state?.routes[props?.state?.index];
          console.log(routeName?.state?.index)
          if (routeName?.state?.index != 0 && routeName?.state?.index != undefined) {
            return null;  
          }
      
          // Otherwise, return the default TabBar
          return (
            <BottomTabBar {...props} />
          );
        }}
      screenOptions={{ headerShown: false,
        tabBarActiveTintColor: '#C6512C'

      }
      
      }>
        <Tab.Screen 
            options={({ route }) => ({
              tabBarVisible: ((route) => {
                const routeName = route.state
                  ? route.state.routes[route.state.index].name
                  : route.params?.screen || 'Home';
        
                const hide = ['Recipe'];
                return !hide.includes(routeName);
              })(route),
              tabBarLabel: 'Meal Pack',
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="backpack" size={size} color={color} />
            )
            })}
        name="HomeStack" component={HomeStackScreen} 
      
       />
        <Tab.Screen name="DiscoverStack" component={DiscoveryStackScreen} options={{ 
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-compass" size={size} color={color} />
        )
      }} 
        
        />

        <Tab.Screen name="SetupStack" component={SetupStackScreen} 
        
        options={() => ({
          tabBarLabel: 'Setup',
          tabBarStyle: { display: 'none' },
          tabBarButton: () => null
        })}
      />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function HomeStackScreen({ navigation }) {
  const [initialRouteName, setInitialRouteName] = useState('Home');

  useEffect(() => {
    async function checkIfHasToken() {
      const authToken = await SecureStore.getItemAsync('authToken');
      if (authToken) {
        setInitialRouteName('Home');
      } else {
        navigation.navigate('SetupStack'); // Navigate to SetupStack if no token
      }
    }
    checkIfHasToken();
  }, [navigation]);

  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{
        headerTintColor: '#C6512C',
        headerTitleStyle: { color: "#000" },
        headerBackTitleVisible: false,
        headerTransparent: true,
        headerBlurEffect: "prominent",
      }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ 
          title: 'Recipes',
          headerLargeTitle: true,
          headerLargeTitleStyle: {
            fontSize: 32,
            fontWeight: "600",
          },
          headerStyle: {
            height: 100,
          },
          headerTransparent: true,
          headerBackTitleVisible: false,
          headerShown: false
      }} />
      <Stack.Screen 
        name="Recipe" 
        component={RecipeScreen}
        options={({ route }) => ({
          title: route.params.recipe.name,
          tabBarStyle: { display: 'none' }
        })} 
      />
      <Stack.Screen options={{ title: "Create A Recipe" }} name="CreateRecipe" component={CreateRecipeScreen} />
    </Stack.Navigator>
  );
}

function SetupStackScreen() {
  return (
    <Stack.Navigator screenOptions={{
      headerTintColor: '#C6512C',
      headerTitleStyle: { color: "#000" },
      headerBackTitleVisible: false,
      headerTransparent: true,
      headerBlurEffect: "prominent",
    }}>
      <Stack.Screen options={{headerShown: false}} name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen options={({ route }) => ({ title: route.params.recipe.name })} name="Recipe" component={RecipeScreen} />
    </Stack.Navigator>
  );
}

function DiscoveryStackScreen() {
  return (
    <Stack.Navigator screenOptions={{
      headerTintColor: '#C6512C',
      headerTitleStyle: { color: "#000" },
      headerBackTitleVisible: false,
      headerTransparent: true,
      headerBlurEffect: "prominent",
    }}>
      <Stack.Screen options={{headerShown: false}} name="Discover" component={DiscoverScreen} />
      <Stack.Screen name="RecipePreview" component={RecipePreviewScreen}
              options={({ route }) => ({
                title: route.params.recipe.name,
                tabBarStyle: { display: 'none' }

              })} 
      />

    </Stack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <Stack.Navigator screenOptions={{
      headerTintColor: '#C6512C',
      headerTitleStyle: { color: "#000" },
      headerBackTitleVisible: false,
      headerTransparent: true,
      headerBlurEffect: "prominent",
    }}>
      <Stack.Screen options={{headerShown: false}} name="Discover" component={DiscoverScreen} />
      <Stack.Screen name="RecipePreview" component={RecipePreviewScreen}
              options={({ route }) => ({
                title: route.params.recipe.name,
                tabBarStyle: { display: 'none' }

              })} 
      />

    </Stack.Navigator>
  );
}


export default App;
