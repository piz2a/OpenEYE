import React, {ReactElement, useEffect, useRef} from "react";
import {Image, StyleSheet, Animated, View, Easing, Text, Alert} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./Template";
import {CommonActions} from "@react-navigation/native";
import {apiUrl} from "../Constants";
import {FaceData} from "../types/FaceData";

const fetchEyePos = async (imageCount: number, callback: (faceDataList: FaceData[] | null) => any) => {
    const responses: any[] = [];
    let count = 0;
    for (let i = 0; i < imageCount; i++) {
        const body = new FormData();
        // @ts-ignore
        body.append('image', {uri: route.params.uris[i], name: 'image.jpg', type: 'image/jpeg'});
        fetch(apiUrl + '/eyepos', {
            method: 'POST',
            body: body
        }).then(
            (response) => {
                response.text().then(console.log);
                return response.json();
            }
        ).then((responseData) => {
            responses.push(responseData);
            console.log(
                "POST Response #", i,
                "Response Body -> " + JSON.stringify(responseData)
            );
            count++;
            // response가 순서대로 오지 않을 수 있으므로 response가 모두 오면 다음 단계로 넘어감
            if (count === imageCount) {
                const faceDataList = jsonProcess(imageCount, responses);
                callback(faceDataList);
            }
        }).catch(reason => {
            console.log('Catch:', reason);
        });
    }
};

const jsonProcess = (imageCount: number, responses: any[]): FaceData[] | null => {
    let peopleImagesCount = imageCount;
    const faceDataList: FaceData[] = [];
    responses.forEach(response => {
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
    });
    if (peopleImagesCount === 0) return null;
    return faceDataList;
};

const generateImage = (faceDataList: FaceData[]) => {
};

function Loading({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Loading'>): ReactElement {
    const spinAnim = useRef(new Animated.Value(0)).current;
    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    useEffect(() => {
        Animated.loop(Animated.timing(spinAnim, {
            toValue: 1,
            duration: 6000,
            easing: Easing.linear,
            useNativeDriver: false,
        })).start();

        fetchEyePos(route.params.uris.length, (faceDataList: FaceData[] | null) => {
            if (faceDataList === null) {
                Alert.alert("탐지된 사람이 없습니다.");
                navigation.popToTop();
                return;
            }
            if (faceDataList.every(faceData => !faceData.eyes.left.open && !faceData.eyes.right.open)) {
                Alert.alert("눈을 뜬 사람을 발견하지 못했습니다.");
                navigation.popToTop();
                return;
            }

            generateImage(faceDataList);

            navigation.dispatch(CommonActions.reset({
                index: 1,
                routes: [
                    { 'name': 'Camera' },
                    { 'name': 'Preview' },
                ]
            }));
        });
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
                <Text style={styles.text}>Loading</Text>
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
})

export default Loading;