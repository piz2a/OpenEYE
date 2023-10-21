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
        <Template btnL={{sourceFileName: "Back", onPress: () => navigation.goBack()}}
                  btnC={{sourceFileName: "Done", onPress: backToPreview}}
                  btnR={{/*처음 설정으로 복귀?*/}}>
            <Text style={{color: "#fff"}}>Out Focusing</Text>
        </Template>
    );
}

export default OutFocusing;