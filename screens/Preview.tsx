import React, {ReactElement} from "react";
import {Image, StyleSheet, Text} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./templates/Template";

function Preview({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Preview'>): ReactElement {
    const bgNum = route.params.selectedEyesData.backgroundNum;
    const minPeopleCount = Math.min(...route.params.analysisList.map(faceDataList => faceDataList.length));
    let openPeopleCount = 0;
    for (let j = 0; j < minPeopleCount; j++) {
        const eyes = route.params.analysisList[bgNum][j].eyes;
        if (!eyes.left.open || !eyes.right.open) openPeopleCount++;
    }

    return (
        <Template btnL={{source: require('../assets/buttons/10.png'), onPress: () => route.params.backToCamera(navigation, route)}}
                  btnC={{source: require('../assets/buttons/9.png'), onPress: () => navigation.navigate('Saving', route.params)}}
                  btnR={{source: require('../assets/buttons/11.png'), onPress: () => navigation.navigate(route.params.cropped ? 'EyeSelection' : 'Loading2', route.params)}}>
            <Image style={styles.image} source={{uri: /*route.params.uris[0]*/route.params.previewImageUri}}/>
            <Image source={require('../assets/labels/15.png')} style={styles.display}/>
            <Text style={{...styles.text, right: 360 - (260 - 20) / 3}}>
                {minPeopleCount}
            </Text>
            <Text style={{...styles.text, right: 360 - (260 + 392 / 2 - 20) / 3}}>
                {openPeopleCount}
            </Text>
        </Template>
    );
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: '100%',
    },
    display: {
        position: 'absolute',
        top: 104 / 3,
        left: 64 / 3,
        width: 392 / 3,
        height: 112 / 3,
    },
    text: {
        position: 'absolute',
        top: 160 / 3 - 14,
        fontFamily: 'Pretendard-Bold',
        fontSize: 18,
        color: "#2B1F45",
    }
});

export default Preview;