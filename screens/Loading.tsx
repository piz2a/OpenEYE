import React, {ReactElement, useEffect} from "react";
import {Text} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {CommonActions} from "@react-navigation/native"
import Template from "./Template";

// navigator history에서 삭제시켜야 한다.

function Loading({ navigation }: NativeStackScreenProps<RootStackParamList, 'Loading'>, setFooterProps: Function): ReactElement {
    useEffect(() => {
        navigation.dispatch(CommonActions.reset({
            index: 1,
            routes: [
                { 'name': 'Camera' },
                { 'name': 'Preview' },
            ]
        }));
    });

    return (
        <Template setFooterProps={setFooterProps} btnL={{}} btnC={{}} btnR={{}}>
            <Text style={{color: "#fff"}}>Loading...</Text>
        </Template>
    );
}

export default Loading;