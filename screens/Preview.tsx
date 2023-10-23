import React, {ReactElement} from "react";
import {StyleSheet, Text, View} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./Template";

function Preview({ navigation }: NativeStackScreenProps<RootStackParamList, 'Preview'>, setFooterProps: Function): ReactElement {
    return (
        <Template setFooterProps={setFooterProps}
                  btnL={{sourceFileName: "Retake", onPress: () => navigation.popToTop()}}
                  btnC={{sourceFileName: "Save", onPress: () => navigation.navigate('Saving')}}
                  btnR={{sourceFileName: "Edit", onPress: () => navigation.navigate('EyeSelection')}}>
            <Text style={{color: "#fff"}}>Preview</Text>
        </Template>
    );
}

export default Preview;