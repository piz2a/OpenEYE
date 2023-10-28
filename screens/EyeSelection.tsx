import React, {ReactElement} from "react";
import {StyleSheet, Text, View} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./Template";

function EyeSelection({ navigation }: NativeStackScreenProps<RootStackParamList, 'EyeSelection'>): ReactElement {
    return (
        <Template btnC={{source: require('../assets/buttons/16.png'), onPress: () => navigation.navigate('OutFocusing')}}>
            <Text style={{color: "#fff"}}>Select Eyes</Text>
        </Template>
    );
}

export default EyeSelection;