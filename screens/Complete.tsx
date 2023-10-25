import React, {ReactElement, useEffect} from "react";
import {Button, Text} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./Template";

// navigator history에서 삭제시켜야 한다.

function Complete({ navigation }: NativeStackScreenProps<RootStackParamList, 'Complete'>): ReactElement {
    return (
        <Template btnL={{}} btnC={{}} btnR={{}}>
            <Text style={{color: "#fff"}}>Complete</Text>
            <Button title="Take another" onPress={navigation.popToTop}/>
        </Template>
    );
}

export default Complete;