import React, {ReactElement, useEffect, useRef, useState} from "react";
import {Alert, Animated, Easing, Image, StyleSheet, Text, View} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./Template";
import {apiUrl} from "../Constants";
import {FaceData, SelectedEyesData} from "../types/FaceData";
import axios from "axios";
import * as FileSystem from 'expo-file-system';
import {Buffer} from "buffer";

const fetchEyePos = async (uris: string[]) => {
    const imageCount = uris.length;
    const responses: any[] = [];
    for (let i = 0; i < imageCount; i++) {
        const body = new FormData();
        // @ts-ignore
        body.append('image', {uri: uris[i], name: 'image.jpg', type: 'image/jpeg'});
        const response = await fetch(apiUrl + '/eyepos', {
            method: 'POST',
            body: body
        })
        const responseData = await response.json();
        console.log(
            "POST Response #", i,
            "Response Body -> " + JSON.stringify(responseData)
        );

        responses.push(responseData);
    }
    return responses;
};

const jsonProcess = (imageCount: number, responses: any[]) => {
    let peopleImagesCount = imageCount;
    const analysisList: FaceData[][] = [];
    responses.forEach(response => {
        const faceDataList: FaceData[] = [];
        const peopleCount: number = response["people"];
        if (peopleCount === 0) {
            peopleImagesCount--;
            return;
        }
        for (let i = 0; i < peopleCount; i++) {
            const faceN = response[`face${i}`];
            const face: number[] = faceN["face"];
            const leftEye: number[] = faceN["lefteye"].pos;
            const leftEyeOpen: boolean = faceN["lefteye"].open;
            const rightEye: number[] = faceN["righteye"].pos;
            const rightEyeOpen: boolean = faceN["righteye"].open;
            faceDataList.push({
                face: face,
                eyes: {
                    left: {pos: leftEye, open: leftEyeOpen},
                    right: {pos: rightEye, open: rightEyeOpen}
                }
            });
        }
        analysisList.push(faceDataList);
    });
    if (peopleImagesCount === 0) return null;
    console.log(JSON.stringify(analysisList));
    return analysisList;
};

const cropImage = async (uri: string, pos: number[], directoryUri: string, fileName: string) => {
    const body = new FormData();
    // @ts-ignore
    body.append('image', {uri: uri, name: 'image.jpg', type: 'image/jpeg'});
    body.append('topleft', `${pos[0]} ${pos[1]}`);
    body.append('bottomright', `${pos[2]} ${pos[3]}`);
    console.log(uri, JSON.stringify(pos));
    const response = await axios.post(apiUrl + '/crop', body);

    const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        directoryUri, fileName, 'image/jpeg'
    );
    await FileSystem.writeAsStringAsync(fileUri, Buffer.from(response.data, 'binary').toString('base64'), { encoding: FileSystem.EncodingType.Base64 });

    return fileUri;
};

const cropFacesAndEyes = async (uris: string[], analysisList: FaceData[][], directoryUri: string) => {
    const newAnalysisList: FaceData[][] = [];
    for (let i = 0; i < analysisList.length; i++) {
        const newFaceDataList: FaceData[] = [];
        for (let j = 0; j < analysisList[i].length; j++) {
            console.log(`${i} ${j}`, JSON.stringify(analysisList[i][j]));
            try {
                const newFaceData: FaceData = {
                    ...analysisList[i][j],
                    eyes: {
                        left: {
                            ...analysisList[i][j].eyes.left,
                            imageUri: await cropImage(
                                uris[i], analysisList[i][j].eyes.left.pos, directoryUri, `eyeLeft-${new Date().getTime()}-${i}-${j}.jpg`
                            )
                        },
                        right: {
                            ...analysisList[i][j].eyes.right,
                            imageUri: await cropImage(
                                uris[i], analysisList[i][j].eyes.right.pos, directoryUri, `eyeRight-${new Date().getTime()}-${i}-${j}.jpg`
                            )
                        }
                    },
                    faceImageUri: await cropImage(
                        uris[i], analysisList[i][j].face, directoryUri, `face-${new Date().getTime()}-${i}-${j}.jpg`
                    )
                };
                newFaceDataList.push(newFaceData);
            } catch (e) {
                console.log(e);
            }
        }
        newAnalysisList.push(newFaceDataList);
    }
    return newAnalysisList;
};

const overlayImage = async (mainUri: string, overlayUri: string, pos: number[], directoryUri: string, fileName: string) => {
    const body = new FormData();
    // @ts-ignore
    body.append('main', {uri: mainUri, name: 'main.jpg', type: 'image/jpeg'});
    // @ts-ignore
    body.append('overlay', {uri: overlayUri, name: 'overlay.jpg', type: 'image/jpeg'});
    body.append('topleft', `${pos[0]} ${pos[1]}`);
    body.append('bottomright', `${pos[2]} ${pos[3]}`);
    const response = await axios.post(apiUrl + '/overlay', body);

    const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        directoryUri, fileName, 'image/jpeg'
    );
    await FileSystem.writeAsStringAsync(fileUri, response.data, { encoding: FileSystem.EncodingType.Base64 });

    return fileUri;
};

const overlayEyes = async (uris: string[], newAnalysisList: FaceData[][], directoryUri: string) => {
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
                        directoryUri,
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

function Loading({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Loading'>): ReactElement {
    const spinAnim = useRef(new Animated.Value(0)).current;
    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });
    const [text, setText] = useState('로딩 중');

    useEffect(() => {
        (async () => {
            Animated.loop(Animated.timing(spinAnim, {
                toValue: 1,
                duration: 6000,
                easing: Easing.linear,
                useNativeDriver: false,
            })).start();

            setText('눈 분석 중');
            const responses = await fetchEyePos(route.params.uris);
            const analysisList = jsonProcess(route.params.uris.length, responses);
            if (analysisList === null) {
                Alert.alert("탐지된 사람이 없습니다.");
                navigation.popToTop();
                return;
            }
            if (analysisList.every(
                faceDataList => faceDataList.every(
                    faceData => !faceData.eyes.left.open && !faceData.eyes.right.open
                )
            )) {
                Alert.alert("눈을 뜬 사람을 발견하지 못했습니다.");
                navigation.popToTop();
                return;
            }

            setText('눈 사진 Crop 중');
            const newAnalysisList = await cropFacesAndEyes(route.params.uris, analysisList, route.params.directoryUri);
            if (!newAnalysisList) {
                Alert.alert("파일 쓰기 권한을 부여해 주세요.");
                navigation.popToTop();
                return;
            }

            setText('눈 사진 합성 중');
            const {previewImageUri, selectedEyesData} = await overlayEyes(route.params.uris, newAnalysisList, route.params.directoryUri);

            navigation.navigate('Preview', {
                uris: route.params.uris,
                directoryUri: route.params.directoryUri,
                newAnalysisList: newAnalysisList,
                previewImageUri: previewImageUri,
                selectedEyesData: selectedEyesData,
            });
            /*navigation.dispatch(CommonActions.reset({
                index: 1,
                routes: [
                    { 'name': 'Camera' },
                    { 'name': 'Preview' },
                ]
            }));*/
        })();
    }, []);

    const iconSize = 150;

    return (
        <Template btnL={{}} btnC={{}} btnR={{}}>
            <View style={styles.center}>
                <Animated.Image source={require('../assets/eyelesslogo.png')} style={{width: iconSize, height: iconSize, transform: [{rotate: spin}]}}/>
            </View>
            <View style={styles.center}>
                <Image source={require('../assets/eyeonlylogo.png')} style={{width: iconSize, height: iconSize}}/>
            </View>
            <View style={styles.center}>
                <Text style={styles.text}>{text}</Text>
            </View>
        </Template>
    );
}

const styles = StyleSheet.create({
    center: {
        position: 'absolute',
        top: 50, left: 0, right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: 'Pretendard-Regular',
        fontSize: 30,
        marginTop: 220,
        color: "#2B1F45",
    }
});

export default Loading;