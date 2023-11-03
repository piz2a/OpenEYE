import React, {ReactElement, useEffect, useRef, useState} from "react";
import {Animated, Easing, Image, StyleSheet, Text, View} from "react-native";
import Template from "./Template";

interface LoadingTemplateProps {
    callbackProcess: (setText: Function) => Promise<void>
}

function LoadingTemplate({ callbackProcess }: LoadingTemplateProps): ReactElement {
    const spinAnim = useRef(new Animated.Value(0)).current;
    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });
    const [text, setText] = useState('로딩 중');

    useEffect(() => {
        Animated.loop(Animated.timing(spinAnim, {
            toValue: 1,
            duration: 6000,
            easing: Easing.linear,
            useNativeDriver: false,
        })).start();

        callbackProcess(setText);
    }, []);

    const iconSize = 150;

    return (
        <Template>
            <View style={styles.center}>
                <Animated.Image source={require('../../assets/eyelesslogo.png')} style={{width: iconSize, height: iconSize, transform: [{rotate: spin}]}}/>
            </View>
            <View style={styles.center}>
                <Image source={require('../../assets/eyeonlylogo.png')} style={{width: iconSize, height: iconSize}}/>
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
        fontFamily: 'Pretendard-Bold',
        fontSize: 25,
        marginTop: 220,
        color: "#2B1F45",
    }
});

export default LoadingTemplate;