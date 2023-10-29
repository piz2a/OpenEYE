import React, {ReactElement} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./Template";

function Preview({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Preview'>): ReactElement {
    return (
        <Template btnL={{source: require('../assets/buttons/10.png'), onPress: () => navigation.popToTop()}}
                  btnC={{source: require('../assets/buttons/9.png'), onPress: () => navigation.navigate('Saving')}}
                  btnR={{source: require('../assets/buttons/11.png'), onPress: () => navigation.navigate('EyeSelection')}}>
            <Image style={styles.image} source={{uri: route.params.previewImageUri}}/>
            <View style={styles.display}>
                <Image source={require('../assets/labels/15.png')} style={{width: 392 / 3, height: 112 / 3}}/>
            </View>
        </Template>
    );
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
    },
    display: {
        position: 'relative',
        display: "flex",
        flexDirection: "row",
        top: 104 / 3,
        left: 64 / 3,
    }
});

export default Preview;