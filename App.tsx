import React, {ReactElement} from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {RootStackParamList} from "./types/RootStackParams";
import CameraScreen from "./screens/CameraScreen";
import Preview from "./screens/Preview";
import Loading from "./screens/Loading";
import EyeSelection from "./screens/EyeSelection";
import Saving from "./screens/Saving";
import Complete from "./screens/Complete";
import OutFocusing from "./screens/OutFocusing";
import {useFonts} from 'expo-font';
import { LogBox } from 'react-native';
import Loading2 from "./screens/Loading2";

const Stack = createStackNavigator<RootStackParamList>();

function App(): ReactElement | null {
    const [fontsLoaded, fontError] = useFonts({
        'Pretendard-Bold': require('./assets/fonts/Pretendard-Bold.otf'),
        'Pretendard-Regular': require('./assets/fonts/Pretendard-Regular.otf'),
    });

    LogBox.ignoreAllLogs();

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{animationEnabled: false, headerShown: false}}>
                <Stack.Screen name="Camera" component={CameraScreen}/>
                <Stack.Screen name="Loading" component={Loading}/>
                <Stack.Screen name="Preview" component={Preview}/>
                <Stack.Screen name="Loading2" component={Loading2}/>
                <Stack.Screen name="EyeSelection" component={EyeSelection}/>
                <Stack.Screen name="OutFocusing" component={OutFocusing}/>
                <Stack.Screen name="Saving" component={Saving}/>
                <Stack.Screen name="Complete" component={Complete}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
