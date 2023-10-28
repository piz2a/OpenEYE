import React, {ReactElement} from "react";
import {StyleSheet, Text, View} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./Template";

function Preview({ navigation }: NativeStackScreenProps<RootStackParamList, 'Preview'>): ReactElement {
    return (
        <Template btnL={{source: require('../assets/buttons/10.png'), onPress: () => navigation.popToTop()}}
                  btnC={{source: require('../assets/buttons/9.png'), onPress: () => navigation.navigate('Saving')}}
                  btnR={{source: require('../assets/buttons/11.png'), onPress: () => navigation.navigate('EyeSelection')}}>
            <Text style={{color: "#fff"}}>Preview</Text>
        </Template>
    );
}

export default Preview;