import React, {ReactElement, useEffect, useRef, useState} from "react";
import {
    Animated,
    StyleSheet,
    View,
    Alert,
    TouchableOpacity,
    GestureResponderEvent,
    Easing
} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./Template";
import {Camera, CameraType} from "expo-camera";

interface TopButtonProps {
    source: any,
    onPress?: (event: GestureResponderEvent) => void,
    marginLeft?: number,
    style?: any,
}

function TopButton({ style, source, onPress, marginLeft = (140 - 112) / 3 }: TopButtonProps) {
    return (
        <TouchableOpacity activeOpacity={1} onPress={onPress ? onPress : () => {}}>
            <Animated.Image source={source} style={{width: 112 / 3, height: 112 / 3, marginLeft: marginLeft, ...style}}/>
        </TouchableOpacity>
    );
}

function TopButtonWrapper() {
    const shownRef = useRef<boolean | null>(false);

    const widthAnim = useRef(new Animated.Value(0)).current;

    const spinAnim = useRef(new Animated.Value(1)).current;
    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg']
    })

    const buttonSources = {
        '16:9': require(`../assets/buttons/2.png`),
        'full': require(`../assets/buttons/2-2.png`),
        'flashOn': require(`../assets/buttons/3.png`),
        'flashOff': require(`../assets/buttons/3-2.png`),
        'timerOff': require(`../assets/buttons/4.png`),
        'timerOn': require(`../assets/buttons/4-2.png`),
    };

    const [orientationButton, setOrientationButton] = useState(false);
    const [flashButton, setFlashButton] = useState(false);
    const [timerButton, setTimerButton] = useState(false);

    const showTopButtons = () => {
        const duration = 300;
        if (shownRef.current === null) return;  // Ignore button press when top buttons are moving
        Animated.timing(widthAnim, {
            toValue: shownRef.current ? 0 : 420 / 3,
            duration: duration,
            useNativeDriver: false,
        }).start();
        Animated.timing(spinAnim, {
            toValue: shownRef.current ? 1 : 0,
            duration: duration,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
        const temp = shownRef.current;
        shownRef.current = null;
        setTimeout(() => {
            shownRef.current = !temp;
        }, duration);
    };

    return (
        <View style={styles.topButtonWrapper}>
            <Animated.View style={{
                ...styles.topButtons,
                width: widthAnim,
            }}>
                <TopButton source={buttonSources[orientationButton ? 'full' : '16:9']} onPress={() => setOrientationButton(!orientationButton)}/>
                <TopButton source={buttonSources[flashButton ? 'flashOn': 'flashOff']} onPress={() => setFlashButton(!flashButton)}/>
                <TopButton source={buttonSources[timerButton ? 'timerOn' : 'timerOff']} onPress={() => setTimerButton(!timerButton)}/>
            </Animated.View>
            <TopButton source={require(`../assets/buttons/1.png`)}
                       marginLeft={0}
                       style={{transform: [{rotate: spin}]}}
                       onPress={showTopButtons}/>
        </View>
    );
}

function CameraScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Camera'>): ReactElement {
    const camera = useRef<Camera>(null);
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();

    // const windowWidth = Dimensions.get('window').width;
    // const windowHeight = Dimensions.get('window').height;

    useEffect(() => {
        if (!permission?.granted) requestPermission();
    }, [permission]);

    const takePicture = async () => {
        if (camera.current/* && permission?.granted && ready*/) {
            setTimeout(async () => {
                let newImageUriList: string[] = [];
                if (!camera.current) return;
                for (let i = 0; i < 3; i++) {
                    const data = await camera.current.takePictureAsync();
                    newImageUriList.push(data.uri);
                    console.log(i);
                }
                console.log(newImageUriList);
                navigation.navigate('Loading', {uris: newImageUriList});
            }, 0);
        } else {
            if (!permission?.granted)
                Alert.alert("No Permission", "Please allow this app permission to use camera");
        }
    }
    const toggleCameraType = () => setType(current => (current === CameraType.back ? CameraType.front : CameraType.back))

    return (
        <Template btnL={{source: require('../assets/buttons/7.png'), style: {width: 160 / 3, height: 160 / 3}}}
                  btnC={{source: require('../assets/buttons/5.png'), style: {width: 192 / 3, height: 192 / 3}, onPress: () => takePicture()}}
                  btnR={{source: require('../assets/buttons/6.png'), style: {width: 160 / 3, height: 160 / 3}, onPress: toggleCameraType}}>
            <Camera ref={camera} style={styles.camera} type={type} ratio={'3:4'}/>
            <TopButtonWrapper/>
            {/*<Text style={{color: "#f00"}}>{windowWidth} {windowHeight}</Text>*/}
            {
                /*
                (() => {
                    if (!camera.current)
                        return <Text>No Camera. Please connect camera to this device.</Text>
                    if (!permission?.granted)
                        return <Text>Please allow this app permission to use camera.</Text>
                    if (!ready)
                        return <Text>Preparing...</Text>
                    return
                })()
                 */
            }
        </Template>
    );
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
        aspectRatio: 3/4,
        width: "100%",
    },
    topButtonWrapper: {
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        top: 104 / 3,
        left: 64 / 3,
    },
    topButtons: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        overflow: "hidden",
        position: "absolute",
        top: 0,
        left: 112 / 3,
    }
});

export default CameraScreen;
