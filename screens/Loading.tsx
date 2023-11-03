import React, {ReactElement} from "react";
import {Alert} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import LoadingTemplate from "./templates/LoadingTemplate";
import {fetchEyePos, jsonProcess, sampleImage} from "../utils/APIRequest";

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
            cropped: false,
        });
    };

    return <LoadingTemplate callbackProcess={callbackProcess}/>;
}

export default Loading;