import React, {ReactElement} from "react";
import {Alert} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {apiUrl} from "../Constants";
import {FaceData, SelectedEyesData} from "../types/FaceData";
import axios from "axios";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from "expo-media-library";
import LoadingTemplate from "./templates/LoadingTemplate";

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

const downloadImage = async (uri: string, fileUri: string) => {
    try {
        const res = await FileSystem.downloadAsync(uri, fileUri);
        const asset = await MediaLibrary.createAssetAsync(res.uri);
        const album = await MediaLibrary.getAlbumAsync('Download');
        if (album == null) {
            await MediaLibrary.createAlbumAsync('Download', asset, false);
        } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
    } catch (err) {
        console.log("downloadImage error:", err);
    }
};

const sampleImage = async (uris: string[], response: any[]): Promise<{previewImageUri: string, selectedEyesData: SelectedEyesData}> => {
    const body = new FormData();
    for (let i = 1; i <= 3; i++) {
        // @ts-ignore
        body.append(`image${i}`, {uri: uris[i - 1], name: `${i}.jpg`, type: 'image/jpeg'});
    }
    body.append('json', JSON.stringify(response));
    await axios.post(apiUrl + '/sampleimg', body).catch(console.log);

    const fileUri = FileSystem.documentDirectory + '/sampleimg.jpg';
    const res = await FileSystem.downloadAsync(apiUrl + '/sampleimg', fileUri);

    return {
        previewImageUri: res.uri,
        selectedEyesData: {backgroundNum: 0, selectedEyeNum: []}
    };
};

function Loading({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Loading'>): ReactElement {
    const callbackProcess = async (setText: Function) => {
        setText('눈 분석 중');
        const responses = await fetchEyePos(route.params.uris);
        const analysisList = jsonProcess(route.params.uris.length, responses);
        if (analysisList === null) {
            Alert.alert("탐지된 사람이 없습니다.");
            route.params.backToCamera(navigation, route);
            return;
        }
        if (analysisList.every(
            faceDataList => faceDataList.every(
                faceData => !faceData.eyes.left.open && !faceData.eyes.right.open
            )
        )) {
            Alert.alert("눈을 뜬 사람을 발견하지 못했습니다.");
            route.params.backToCamera(navigation, route);
            return;
        }

        setText('눈 사진 합성 중');
        // const {previewImageUri, selectedEyesData} = await overlayEyes(route.params.uris, newAnalysisList);
        const {previewImageUri, selectedEyesData} = await sampleImage(route.params.uris, responses);

        navigation.navigate('Preview', {
            ...route.params,
            analysisList: analysisList,
            previewImageUri: previewImageUri,
            selectedEyesData: selectedEyesData,
        });
    };

    return <LoadingTemplate callbackProcess={callbackProcess}/>;
}

export default Loading;