import React, {ReactElement} from "react";
import {StyleSheet, Text, View} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./Template";
import {CommonActions} from "@react-navigation/native";

function OutFocusing({ navigation }: NativeStackScreenProps<RootStackParamList, 'OutFocusing'>): ReactElement {
    const backToPreview = () => navigation.dispatch(CommonActions.reset({
        index: 1,
        routes: [
            { 'name': 'Camera' },
            { 'name': 'Preview' },
        ]
    }));

    return (
        <Template btnL={{source: require('../assets/buttons/21.png')}}
                  btnC={{source: require('../assets/buttons/16.png'), onPress: backToPreview}}
                  btnR={{source: require('../assets/buttons/20.png')}}>
            <Text style={{color: "#fff"}}>Out Focusing</Text>
        </Template>
    );
}

export default OutFocusing;