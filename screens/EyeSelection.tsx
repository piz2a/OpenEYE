import React, {ReactElement, useState} from "react";
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./templates/Template";
import {changeEye, cropImage} from "../utils/APIRequest";

interface SelectedEye {
    left: number
    right: number
}

function EyeSelection({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'EyeSelection'>): ReactElement {
    const minFaceCount = Math.min(...route.params.analysisList.map(faceDataList => faceDataList.length));

    const [selectedFaceNum, setSelectedFaceNum] = useState(0);
    const [selectedEyeList, setSelectedEyeList] = useState<SelectedEye[]>(
        new Array(minFaceCount).fill({left: 0, right: 0})
    );

    const selectedFaceData = route.params.analysisList
        [route.params.selectedEyesData.backgroundNum]
        [selectedFaceNum];
    console.log('selectedFaceData:', JSON.stringify(selectedFaceData));

    const [newImageUri, setNewImageUri] = useState(route.params.previewImageUri);
    const [previewFaceImageUri, setPreviewFaceImageUri] = useState(
        selectedFaceData.faceImageUri ? selectedFaceData.faceImageUri : ''
    );

    const setEye = (side: string, eyeNum: number) => {
        const newSelectedEye = selectedEyeList[selectedFaceNum];
        newSelectedEye[side === 'left' ? 'left' : 'right'] = eyeNum;
        console.log(`newSelectedEye: {left: ${newSelectedEye.left}, right: ${newSelectedEye.right}}`);
        setSelectedEyeList([
            ...selectedEyeList.slice(0, selectedFaceNum),
            newSelectedEye,
            ...selectedEyeList.slice(selectedFaceNum + 1)
        ]);

        const eye = route.params.analysisList[eyeNum][selectedFaceNum].eyes[side === 'left' ? 'left' : 'right'];
        changeEye(
            route.params.previewImageUri,
            eye.imageUri ? eye.imageUri : '',
            eye.pos
        ).then(previewUri => {
            console.log('previewUri:', previewUri);
            setNewImageUri(previewUri);

            cropImage(
                previewUri,
                route.params.analysisList[route.params.selectedEyesData.backgroundNum][selectedFaceNum].face,
                'editCropImage.jpg'
            ).then(newPreviewFaceUri => setPreviewFaceImageUri(newPreviewFaceUri));
        });
    };

    const saveChanges = () => {
        navigation.navigate('Preview', {...route.params, previewImageUri: newImageUri});
    };

    return (
        <Template mainStyle={{justifyContent: 'space-between', gap: 0}}
                  btnC={{source: require('../assets/buttons/16.png'), onPress: saveChanges}}>
            <View style={{flex: 1, justifyContent: 'center', marginTop: 40}}>
                <Text style={styles.title}>눈 선택하기</Text>
            </View>
            <View style={styles.wrapper1}>
                <View style={styles.wrapper2}>
                    <View style={styles.eyeSelectorScroll}>
                        {route.params.analysisList.map((faceDataList, index) => (
                            <View key={index} style={styles.eyeSelectorLi}>
                                <TouchableOpacity style={styles.eyeTouchable} activeOpacity={0.5} onPress={() => setEye('right', index)}>
                                    <Image source={{uri: faceDataList[selectedFaceNum].eyes.right.imageUri}}
                                           style={{...styles.eye, ...(selectedEyeList[selectedFaceNum].right === index ? styles.borderSelected : styles.border)}}/>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.eyeTouchable} activeOpacity={0.5} onPress={() => setEye('left', index)}>
                                    <Image source={{uri: faceDataList[selectedFaceNum].eyes.left.imageUri}}
                                           style={{...styles.eye, ...(selectedEyeList[selectedFaceNum].left === index ? styles.borderSelected : styles.border)}}/>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                    <View style={styles.previewImageWrapper}>
                        <Image style={styles.faceImage} source={{uri: previewFaceImageUri}}/>
                    </View>
                </View>
                <ScrollView contentContainerStyle={styles.faceSelector} horizontal={true}>
                    {route.params.analysisList[route.params.selectedEyesData.backgroundNum].map(
                        (faceData, index) => (
                            <TouchableOpacity key={index}
                                              activeOpacity={0.5}
                                              style={{height: 140}}
                                              onPress={() => setSelectedFaceNum(index)}>
                                <Image source={{uri: faceData.faceImageUri}}
                                       style={{...styles.eyesForSelect, ...(selectedFaceNum === index ? styles.borderSelected : styles.border)}}/>
                            </TouchableOpacity>
                        )
                    )}
                </ScrollView>
            </View>
            <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Preview', route.params)} style={styles.backButtonWrapper}>
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
        borderColor: '#2B1F45',
        borderWidth: 5,
        borderRadius: 10,
    },
    eyeSelectorScroll: {
        position: 'absolute',
        top: -100,
        left: -20,
        width: 360,
        height: 200,
        flex: 1,
        justifyContent: "center",
        // backgroundColor: 'red',
        margin: 20,
    },
    eyeSelectorLi: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
    },
    eyeTouchable: {
        width: 70,
        maxWidth: 70,
        height: 40,
        marginRight: 5,
        flex: 1,
        justifyContent: "center",
    },
    eye: {
        width: 70,
        height: 35,
    },
    faceSelector: {
        position: 'absolute',
        marginTop: '10%',
        width: 360,
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "yellow",
        height: 140,
        paddingBottom: 10,
    },
    eyesForSelect: {
        width: 120,
        height: 120,
        paddingBottom: 10,
    },
    border: {
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 6,
    },
    borderSelected: {
        borderColor: "#2B1F45",
        borderWidth: 3,
        borderRadius: 6,
    },
    backButtonWrapper: {
        position: 'absolute',
        left: (120 - 56) / 3,
        top: (160 - 56) / 3,
    },
});

export default EyeSelection;