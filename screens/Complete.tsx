import React, {ReactElement} from "react";
import {Text} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./templates/Template";

function Complete({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Complete'>): ReactElement {
    return (
        <Template btnC={{source: require('../assets/buttons/16.png'), onPress: () => route.params.backToCamera(navigation, route)}}>
            <Text style={{color: "#fff", fontFamily: 'Pretendard-Bold', fontSize: 25}}>저장이 완료되었습니다</Text>
        </Template>
    );
}

export default Complete;