import React, {ReactElement, useRef, useState} from 'react';
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
    /*
    const footerPropsRef = useRef<FooterProps>({btnL: {}, btnC: {}, btnR: {}});
    const {footer, updateFooter} = Footer({propsRef: footerPropsRef})

    const setFooterProps = (footerProps: FooterProps) => {
        footerPropsRef.current = footerProps;
        updateFooter();
    };
    const [imageUriList, setImageUriList] = useState<string[] | null>(null);
     */
    return (
        <>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{animationEnabled: false, headerShown: false}}>
                    <Stack.Screen name="Camera" component={CameraScreen}/>
                    <Stack.Screen name="Loading" component={Loading}/>
                    <Stack.Screen name="Preview" component={Preview}/>
                    <Stack.Screen name="EyeSelection" component={EyeSelection}/>
                    <Stack.Screen name="OutFocusing" component={OutFocusing}/>
                    <Stack.Screen name="Saving" component={Saving}/>
                    <Stack.Screen name="Complete" component={Complete}/>
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}

export default App;
