import React, {ReactElement, useState} from 'react';
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
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Footer, {FooterProps} from "./components/footer/Footer";

const Stack = createStackNavigator<RootStackParamList>();

function App(): ReactElement {
    const [footerProps, setFooterProps] = useState<FooterProps>(
        {btnL: {}, btnC: {}, btnR: {}}
    );
    const setFooterProps1 = (a: FooterProps) => {};
    const [imageUriList, setImageUriList] = useState<string[] | null>(null);
    return (
        <>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{animationEnabled: false, headerShown: false}}>
                    <Stack.Screen name="Camera"
                                  component={(props: NativeStackScreenProps<RootStackParamList, 'Camera'>) => CameraScreen(props, setFooterProps, setImageUriList)}/>
                    <Stack.Screen name="Loading"
                                  component={(props: NativeStackScreenProps<RootStackParamList, 'Loading'>) => Loading(props, setFooterProps)}/>
                    <Stack.Screen name="Preview"
                                  component={(props: NativeStackScreenProps<RootStackParamList, 'Preview'>) => Preview(props, setFooterProps)}/>
                    <Stack.Screen name="EyeSelection"
                                  component={(props: NativeStackScreenProps<RootStackParamList, 'EyeSelection'>) => EyeSelection(props, setFooterProps)}/>
                    <Stack.Screen name="OutFocusing"
                                  component={(props: NativeStackScreenProps<RootStackParamList, 'OutFocusing'>) => OutFocusing(props, setFooterProps)}/>
                    <Stack.Screen name="Saving"
                                  component={(props: NativeStackScreenProps<RootStackParamList, 'Saving'>) => Saving(props, setFooterProps)}/>
                    <Stack.Screen name="Complete"
                                  component={(props: NativeStackScreenProps<RootStackParamList, 'Complete'>) => Complete(props, setFooterProps)}/>
                </Stack.Navigator>
            </NavigationContainer>
            <Footer {...footerProps}/>
        </>
    );
}

export default App;
