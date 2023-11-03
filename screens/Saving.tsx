import React, {ReactElement, useEffect} from "react";
import {Text} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./templates/Template";
import {CommonActions} from "@react-navigation/native";

// navigator history에서 삭제시켜야 한다.

function Saving({ navigation }: NativeStackScreenProps<RootStackParamList, 'Saving'>): ReactElement {
    useEffect(() => {
        navigation.dispatch(CommonActions.reset({
            index: 2,
            routes: [
                { 'name': 'Camera' },
                { 'name': 'Preview' },
                { 'name': 'Complete' },
            ]
        }));
    });

    return (
        <Template btnL={{}} btnC={{}} btnR={{}}>
            <Text style={{color: "#fff"}}>Saving...</Text>
        </Template>
    );
}

export default Saving;