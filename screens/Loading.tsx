import React, {ReactElement, useEffect, useRef} from "react";
import {Image, StyleSheet, Animated, View, Easing, Text} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./Template";
import {CommonActions} from "@react-navigation/native";
import {apiUrl} from "../Constants";

function Loading({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Loading'>): ReactElement {
    const spinAnim = useRef(new Animated.Value(0)).current;
    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const fetchEyePos = async () => {
        const responses: any[] = [];
        let count = 0;
        for (let i = 0; i < route.params.uris.length; i++) {
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
                if (count === route.params.uris.length) {
                    jsonProcess(responses);
                }
            }).catch(reason => {
                console.log('Catch:', reason);
            });
        }
    };

    const jsonProcess = (responses: any[]) => {
        navigation.dispatch(CommonActions.reset({
            index: 1,
            routes: [
                { 'name': 'Camera' },
                { 'name': 'Preview' },
            ]
        }));
    };

    useEffect(() => {
        Animated.loop(Animated.timing(spinAnim, {
            toValue: 1,
            duration: 6000,
            easing: Easing.linear,
            useNativeDriver: false,
        })).start();

        fetchEyePos();
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