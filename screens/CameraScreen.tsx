import React, {ReactElement, useEffect, useRef, useState} from "react";
import {Image, StyleSheet, Text, View, Alert} from "react-native";
import {RootStackParamList} from "../types/RootStackParams";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Template from "./Template";
import {Camera, CameraType} from "expo-camera";

function CameraScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Camera'>): ReactElement {
    const camera = useRef<Camera>(null);
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [ready, setReady] = useState(false);

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
        <Template btnL={{sourceFileName: "Recent"}}
                  btnC={{sourceFileName: "Take", onPress: () => takePicture() /*navigation.navigate('Loading')}*/}}
                  btnR={{sourceFileName: "Turn", onPress: toggleCameraType}}>
            {
                <Camera ref={camera} onCameraReady={() => setReady(true)} style={styles.camera} type={type} ratio={'4:3'}/>
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
                /*
                <View style={{flex: 1}}>
                    <Image source={{uri: imageUriList[0]}} style={styles.image}/>
                    <Image source={{uri: imageUriList[1]}} style={styles.image}/>
                    <Image source={{uri: imageUriList[2]}} style={styles.image}/>
                </View>
                 */
            }
        </Template>
    );
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
        aspectRatio: 4/3,
        width: "100%",
    },
    image: {
        flex: 1,
        aspectRatio: 1,
        width: "20%",
        height: "20%",
    },
})

export default CameraScreen;
