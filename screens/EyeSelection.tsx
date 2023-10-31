import React, {ReactElement, useState} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./Template";

function EyeSelection({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'EyeSelection'>): ReactElement {
    const [selectedFaceNum, setSelectedFaceNum] = useState(0);
    const [selectedEyeNumList, setSelectedEyeNumList] = useState<number[]>([]);

    return (
        <Template btnC={{source: require('../assets/buttons/16.png'), onPress: () => navigation.navigate('OutFocusing')}}>
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={styles.title}>눈 선택하기</Text>
            </View>
            <View style={styles.imageWrapperWrapper}>
                <View style={styles.faceImageWrapper}>
                    <Image source={{uri: route.params.newAnalysisList
                            [route.params.selectedEyesData.backgroundNum]
                            [route.params.selectedEyesData.selectedEyeNum[selectedFaceNum]]
                            .faceImageUri}}></Image>
                </View>
                <View style={styles.eyeImagesWrapper}>
                </View>
            </View>
        </Template>
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: "Pretendard-Bold",
        fontSize: 30,
        color: "#2B1F45",
    },
    imageWrapperWrapper: {},
    faceImageWrapper: {},
    eyeImagesWrapper: {}
});

export default EyeSelection;