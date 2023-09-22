import { View, SafeAreaView, TouchableOpacity, Dimensions, StyleSheet, Text, Image, Button, TextInput } from 'react-native';
import { useState, useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import welcomeGif from '../assets/welcome.gif'

export default function Welcome({ navigation }) {
    const [height, setHeight] = useState('');
    const [width, setWidth] = useState('');
  
    useEffect(() => {
      //handler to get device Height
      setHeight(Dimensions.get('window').height);
      //handler to get device Width
      setWidth(Dimensions.get('window').width);
    }, []);


    return (
        <View style={{width: "100%", position: 'relative', height: "100%", justifyContent: "center", alignItems: "center"}}>
<StatusBar style="light" />
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
            <Image style={{width: width, position: "absolute", height: "100%"}} source={welcomeGif}/>
            <SafeAreaView style={{zIndex: 2}}>
            <View style={{display: 'flex', justifyContent: "space-between", height: "100%"}}>
            <View style={{width: "100%"}}>
            <Text style={{fontSize: 58, marginTop: 16, textAlign: "center", fontWeight: 800, color: "#fff"}}>Meal Pack</Text>
            <Text style={{fontSize: 16, textAlign: "center", color: "#fff"}}>Create, Store, and Share Recipes</Text>
            </View>
            
            <View>
            <TouchableOpacity 
                    onPress={() => navigation.navigate("Signup")}

            style={{display: "flex", width: width - 32, marginLeft: 16, marginRight: 16}}>
            <Text style={{fontSize: 18, textAlign: "center", color: "#fff", borderRadius: 16, overflow: "hidden", backgroundColor: "#C6512C", padding: 16}}>
            Get Started
            </Text>
            
            </TouchableOpacity>
            <TouchableOpacity 
                    onPress={() => navigation.navigate("Login")}

            style={{display: "flex", width: width - 32, marginLeft: 16, marginRight: 16}}>
            <Text style={{fontSize: 18, textAlign: "center", color: "#fff", borderRadius: 16, overflow: "hidden", paddingTop: 16}}>
            Already Have An Account? Login
            </Text>
            
            </TouchableOpacity>
            </View>
            </View>
            </SafeAreaView>
        </View>
    )

}