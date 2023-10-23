import React, {ReactElement} from "react";
import {StyleSheet, Text, View} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./Template";

function EyeSelection({ navigation }: NativeStackScreenProps<RootStackParamList, 'EyeSelection'>, setFooterProps: Function): ReactElement {
    return (
        <Template setFooterProps={setFooterProps}
                  btnL={{sourceFileName: "Back", onPress: () => navigation.goBack()}}
                  btnC={{sourceFileName: "Next", onPress: () => navigation.navigate('OutFocusing')}}
                  btnR={{/*처음 설정으로 복귀?*/}}>
            <Text style={{color: "#fff"}}>Select Eyes</Text>
        </Template>
    );
}

export default EyeSelection;