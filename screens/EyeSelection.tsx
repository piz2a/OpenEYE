import React, {ReactElement, useState} from "react";
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./Template";
import {FaceData, SelectedEyesData} from "../types/FaceData";
import axios from "axios/index";
import {apiUrl} from "../Constants";
import * as FileSystem from "expo-file-system";

const overlayImage = async (mainUri: string, overlayUri: string, pos: number[], fileName: string) => {
    const body = new FormData();
    // @ts-ignore
    body.append('main', {uri: mainUri, name: 'main.jpg', type: 'image/jpeg'});
    // @ts-ignore
    body.append('overlay', {uri: overlayUri, name: 'overlay.jpg', type: 'image/jpeg'});
    body.append('topleft', `${pos[0]} ${pos[1]}`);
    body.append('bottomright', `${pos[2]} ${pos[3]}`);
    await axios.post(apiUrl + '/overlay', body).catch(console.log);

    const fileUri = FileSystem.documentDirectory + '/' + fileName;
    const res = await FileSystem.downloadAsync(apiUrl + '/overlay', fileUri, {});

    return res.uri;
};

const overlayEyes = async (uris: string[], newAnalysisList: FaceData[][]) => {
    const bgImageNum = 0;
    let mainImageUri = uris[bgImageNum];
    const minFaceCount = Math.min(...newAnalysisList.map(faceDataList => faceDataList.length));
    const selectedEyesData: SelectedEyesData = {
        backgroundNum: bgImageNum,
        selectedEyeNum: []
    };

    for (let j = 0; j < minFaceCount; j++) {
        for (let i = 0; i < newAnalysisList.length; i++) {
            if (![0, 1].every(eyeNum => newAnalysisList[i][j].eyes[eyeNum === 0 ? 'left' : 'right'].open))
                continue;
            for (let eyeNum = 0; eyeNum < 2; eyeNum++) {
                const eye = newAnalysisList[i][j].eyes[eyeNum === 0 ? 'left' : 'right'];
                if (i !== bgImageNum) {
                    mainImageUri = await overlayImage(
                        mainImageUri,
                        eye.imageUri ? eye.imageUri : '',
                        newAnalysisList[i][j].eyes.left.pos,
                        `overlay.jpg`
                    );
                }
            }
            selectedEyesData.selectedEyeNum.push(i);
            break;
        }
    }

    const previewImageUri = mainImageUri;
    return {previewImageUri, selectedEyesData};
};

function EyesForSelect({ faceData }: { faceData: FaceData }) {
    return (
        <Image source={{uri: faceData.faceImageUri}} style={styles.eyesForSelect}/>
    );
}

function EyeSelection({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'EyeSelection'>): ReactElement {
    const [selectedFaceNum, setSelectedFaceNum] = useState(0);
    const [selectedEyeNumList, setSelectedEyeNumList] = useState<number[]>([]);

    const selectedFaceData = route.params.newAnalysisList
        [route.params.selectedEyesData.backgroundNum]
        [selectedFaceNum];
    console.log('selectedFaceData:', JSON.stringify(selectedFaceData));

    return (
        <Template mainStyle={{justifyContent: 'space-between', gap: 0}}
                  btnC={{source: require('../assets/buttons/16.png'), onPress: () => navigation.navigate('OutFocusing')}}>
            <View style={{flex: 1, justifyContent: 'center', marginTop: 40}}>
                <Text style={styles.title}>눈 선택하기</Text>
            </View>
            <View style={styles.wrapper1}>
                <View style={styles.wrapper2}>
                    <View style={styles.eyeSelectorScroll}>
                        {route.params.newAnalysisList.map((faceDataList, index) => {
                            const selectedFaceData = faceDataList[selectedFaceNum];
                            return (
                                <View key={index} style={styles.eyeSelectorLi}>
                                    <Image source={{uri: selectedFaceData.eyes.right.imageUri}} style={styles.eye}/>
                                    <Image source={{uri: selectedFaceData.eyes.left.imageUri}} style={styles.eye}/>
                                </View>
                            );
                        })}
                    </View>
                    <View style={styles.previewImageWrapper}>
                        <Image style={styles.faceImage}
                               source={{uri: selectedFaceData.faceImageUri}}/>
                    </View>
                </View>
                <ScrollView contentContainerStyle={styles.faceSelector} horizontal={true}>
                    {route.params.newAnalysisList[route.params.selectedEyesData.backgroundNum].map(
                        (faceData, index) => <EyesForSelect key={index} faceData={faceData}/>
                    )}
                </ScrollView>
            </View>
            <TouchableOpacity activeOpacity={1} onPress={navigation.goBack} style={styles.backButtonWrapper}>
                <Image source={require('../assets/buttons/8.png')} style={{width: 112 / 3, height: 112 / 3}}/>
            </TouchableOpacity>
        </Template>
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: "Pretendard-Bold",
        fontSize: 30,
        color: "#2B1F45",
    },
    wrapper1: {
        flex: 1,
        justifyContent: "space-between",
        gap: 0,
        width: 360,
        height: '84%',
    },
    wrapper2: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: 360,
        height: 200,
        aspectRatio: 1,
    },
    previewImageWrapper: {
        position: 'absolute',
        top: -60,
        left: 75,
        width: 200,
        height: 160,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    faceImage: {
        width: 150,
        height: 150,
    },
    eyeSelectorScroll: {
        position: 'absolute',
        top: -100,
        left: -20,
        width: 360,
        height: 200,
        flex: 1,
        justifyContent: "center",
        backgroundColor: 'red',
        margin: 20,
    },
    eyeSelectorLi: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
    },
    eye: {
        width: 70,
        marginRight: 5,
    },
    faceSelector: {
        position: 'absolute',
        marginTop: '10%',
        width: 360,
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "blue",
        height: 120,
    },
    eyesForSelect: {
        width: 120,
        height: 120,
    },
    backButtonWrapper: {
        position: 'absolute',
        left: (120 - 56) / 3,
        top: (160 - 56) / 3,
    },
});

export default EyeSelection;